import { Children, cloneElement, isValidElement, type HTMLAttributes, type ReactElement, type ReactNode } from 'react';

type InlineProps = { children?: ReactNode };
const inlineTags = new Set(['span', 'strong', 'em', 'b', 'i', 'br']);

function readableText(children: ReactNode): string | null {
  let text = '';
  for (const child of Children.toArray(children)) {
    if (typeof child === 'string' || typeof child === 'number') text += String(child);
    else if (isValidElement<InlineProps>(child) && typeof child.type === 'string' && inlineTags.has(child.type)) {
      const nested = child.type === 'br' ? ' ' : readableText(child.props.children);
      if (nested === null) return null;
      text += nested;
    } else return null;
  }
  return text;
}

/** React owns every span. Hindi words stay intact, including matras and ligatures. */
function visualText(children: ReactNode): ReactNode {
  return Children.map(children, (child) => {
    if (typeof child === 'string' || typeof child === 'number') {
      return <span className="mw-motion-run" aria-hidden="true">{String(child).split(/(\s+)/).map((word, index) => {
        if (!word || /^\s+$/.test(word)) return word;
        // ASCII letters can move independently. Other scripts/emoji remain whole words.
        const glyphs = /^[\x21-\x7e]+$/.test(word) ? [...word] : [word];
        return <span className="mw-motion-word" key={index}>{glyphs.map((glyph, i) => <span className="mw-motion-glyph" key={i}>{glyph}</span>)}</span>;
      })}</span>;
    }
    if (isValidElement<InlineProps>(child) && child.type !== 'br') {
      return cloneElement(child as ReactElement<InlineProps>, {}, visualText(child.props.children));
    }
    return child;
  });
}

export function MotionHeading({ as: Tag = 'h2', children, className = '', ...props }: HTMLAttributes<HTMLHeadingElement> & { as?: 'h1' | 'h2' | 'h3' }) {
  const text = readableText(children);
  // Interactive headings and screen-reader-only headings retain their original DOM semantics.
  const split = text !== null && text.length < 180 && !/(^|\s)(sr|sr-only)(\s|$)/.test(className);
  return <Tag {...props} className={`mw-motion-heading ${className}`.trim()} data-mw-heading={split ? 'split' : 'whole'} aria-label={props['aria-label'] ?? (split ? text : undefined)}>
    {split ? visualText(children) : children}
  </Tag>;
}
