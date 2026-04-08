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

// LaTeX patterns to detect and render with KaTeX
const MATH_PATTERNS = [
  { regex: /\$\$([\s\S]+?)\$\$/g, displayMode: true },
  { regex: /\\\[([\s\S]+?)\\\]/g, displayMode: true },
  { regex: /\\\(([\s\S]+?)\\\)/g, displayMode: false },
  { regex: /\$([^$\n]+?)\$/g, displayMode: false }
];

function renderMath(text) {
  return MATH_PATTERNS.reduce((html, { regex, displayMode }) =>
    html.replace(regex, (_, formula) => {
      try {
        return katex.renderToString(formula.trim(), {
          throwOnError: false,
          displayMode,
          output: 'html',
          strict: 'ignore',
          trust: true
        });
      } catch {
        return _;
      }
    }),
  text);
}

export function renderLatexInHtml(rawHtml) {
  if (!rawHtml) return '';

  // Step 1: Sanitize raw HTML from database
  const sanitized = DOMPurify.sanitize(rawHtml, {
    ALLOWED_TAGS: DEFAULT_ALLOWED_TAGS,
    ALLOWED_ATTR: DEFAULT_ALLOWED_ATTR,
    ALLOW_DATA_ATTR: true,
    FORCE_BODY: false
  });

  // Step 2: Render LaTeX patterns with KaTeX
  const withMath = renderMath(sanitized);

  // Step 3: Decode remaining HTML entities in text nodes (not in tags)
  return withMath
    .replace(/&nbsp;/g, ' ')
    .replace(/&#160;/g, ' ')
    .replace(/&amp;(?![a-zA-Z#\d]+;)/g, '&')
    .replace(/\\n/g, '\n')
    .trim();
}
