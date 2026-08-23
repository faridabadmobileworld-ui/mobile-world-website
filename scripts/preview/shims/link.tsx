/**
 * next/link की जगह — सिर्फ़ preview file के लिए।
 * अंदर के link "#" वाले पते पर जाते हैं, बाहर के (tel:, https:) वैसे ही।
 */

import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import { go } from "./navigation";

type Props = {
  href: string;
  children: ReactNode;
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

export default function Link({
  href,
  children,
  onClick,
  prefetch: _prefetch,
  replace: _replace,
  scroll: _scroll,
  ...rest
}: Props) {
  const internal = href.startsWith("/");

  return (
    <a
      href={internal ? `#${href}` : href}
      onClick={(e: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(e);
        if (!internal || e.defaultPrevented) return;
        e.preventDefault();
        go(href);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
