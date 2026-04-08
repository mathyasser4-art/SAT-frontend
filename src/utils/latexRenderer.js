import katex from 'katex';
import DOMPurify from 'dompurify';

const DEFAULT_ALLOWED_TAGS = [
  'p', 'b', 'strong', 'i', 'em', 'u', 'br', 'ul', 'ol', 'li', 'span', 'img',
  'h1', 'h2', 'h3', 'blockquote'
];
const DEFAULT_ALLOWED_ATTR = ['src', 'alt', 'style', 'class', 'width', 'height'];

const MATH_PATTERNS = [
  { regex: /\$\$([\s\S]+?)\$\$/g, displayMode: true },
  { regex: /\\\[([\s\S]+?)\\\]/g, displayMode: true },
  { regex: /\\\(([\s\S]+?)\\\)/g, displayMode: false },
  { regex: /\$([^\$]+?)\$/g, displayMode: false }
];

function renderMath(text) {
  return MATH_PATTERNS.reduce((html, { regex, displayMode }) =>
    html.replace(regex, (_, formula) => {
      try {
        return katex.renderToString(formula, {
          throwOnError: false,
          displayMode,
          output: 'html',
          strict: 'ignore'
        });
      } catch (error) {
        return _;
      }
    }),
  text);
}

export function renderLatexInHtml(rawHtml) {
  const sanitized = DOMPurify.sanitize(rawHtml || '', {
    ALLOWED_TAGS: DEFAULT_ALLOWED_TAGS,
    ALLOWED_ATTR: DEFAULT_ALLOWED_ATTR
  });

  const withMath = renderMath(sanitized);

  return withMath
    .replace(/&nbsp;|&#160;|&amp;|<|>|"|&#x27;/g, (match) => ({
      '&nbsp;': ' ',
      '&#160;': ' ',
      '&amp;': '&',
      '<': '<',
      '>': '>',
      '"': '"',
      '&#x27;': "'"
    })[match] || match)
    .replace(/\\n/g, '\n')
    .trim();
}
