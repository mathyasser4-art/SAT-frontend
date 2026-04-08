import katex from 'katex';
import DOMPurify from 'dompurify';

// Tags allowed in question HTML (includes SVG for potential MathQuill stored SVG)
const DEFAULT_ALLOWED_TAGS = [
  'p', 'b', 'strong', 'i', 'em', 'u', 'br', 'ul', 'ol', 'li',
  'span', 'div', 'img', 'h1', 'h2', 'h3', 'blockquote', 'pre', 'code',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  // SVG support for MathQuill stored output
  'svg', 'path', 'g', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon',
  'use', 'defs', 'symbol', 'text', 'tspan'
];

const DEFAULT_ALLOWED_ATTR = [
  'src', 'alt', 'style', 'class', 'width', 'height',
  'dir', 'lang', 'href', 'target', 'colspan', 'rowspan',
  // SVG attributes
  'd', 'fill', 'stroke', 'stroke-width', 'viewBox', 'xmlns',
  'x', 'y', 'x1', 'y1', 'x2', 'y2', 'cx', 'cy', 'r', 'rx', 'ry',
  'transform', 'points', 'preserveAspectRatio', 'font-size', 'text-anchor',
  // Accessibility
  'aria-hidden', 'aria-label', 'role',
  // Data attributes are allowed by DOMPurify by default
];

// LaTeX patterns to detect and render with KaTeX (for $...$, $$...$$, \[...\], \(...\))
const MATH_PATTERNS = [
  { regex: /\$\$([\s\S]+?)\$\$/g, displayMode: true },
  { regex: /\\\[([\s\S]+?)\\\]/g, displayMode: true },
  { regex: /\\\(([\s\S]+?)\\\)/g, displayMode: false },
  { regex: /\$([^$\n]+?)\$/g, displayMode: false }
];

function renderKatex(formula, displayMode) {
  try {
    // Decode HTML entities that may be present in data-value attributes
    const decoded = formula
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
    return katex.renderToString(decoded.trim(), {
      throwOnError: false,
      displayMode,
      output: 'html',
      strict: 'ignore',
      trust: true
    });
  } catch {
    return formula;
  }
}

/**
 * Handle Quill editor's ql-formula spans.
 * Quill stores math as: <span class="ql-formula" data-value="LaTeX">?</span>
 * The inner text "?" is just a placeholder — the real formula is in data-value.
 * We render each such span with KaTeX before DOMPurify sanitization.
 */
function renderQuillFormulas(html) {
  return html.replace(
    /<span\b[^>]*class="[^"]*ql-formula[^"]*"[^>]*>[\s\S]*?<\/span>/g,
    (match) => {
      const dvMatch = match.match(/data-value="([^"]*)"/);
      if (!dvMatch) return match;
      return renderKatex(dvMatch[1], false);
    }
  );
}

function renderMath(text) {
  return MATH_PATTERNS.reduce((html, { regex, displayMode }) =>
    html.replace(regex, (_, formula) => renderKatex(formula, displayMode)),
  text);
}

export function renderLatexInHtml(rawHtml) {
  if (!rawHtml) return '';

  // Step 1: Render Quill ql-formula spans BEFORE sanitization
  //         so data-value LaTeX is captured before DOMPurify can touch the attribute
  const withQuillMath = renderQuillFormulas(rawHtml);

  // Step 2: Sanitize — DOMPurify removes XSS vectors while preserving KaTeX HTML output
  const sanitized = DOMPurify.sanitize(withQuillMath, {
    ALLOWED_TAGS: DEFAULT_ALLOWED_TAGS,
    ALLOWED_ATTR: DEFAULT_ALLOWED_ATTR,
    ALLOW_DATA_ATTR: true,
    FORCE_BODY: false
  });

  // Step 3: Render any remaining LaTeX delimiters ($...$, $$...$$, \[...\], \(...\))
  const withMath = renderMath(sanitized);

  // Step 4: Decode remaining HTML entities in text content
  return withMath
    .replace(/&nbsp;/g, ' ')
    .replace(/&#160;/g, ' ')
    .replace(/&amp;(?![a-zA-Z#\d]+;)/g, '&')
    .replace(/\\n/g, '\n')
    .trim();
}
