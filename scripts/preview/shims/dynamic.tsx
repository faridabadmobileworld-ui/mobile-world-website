/**
 * next/dynamic की जगह — सिर्फ़ preview file के लिए।
 *
 * असली website पर यह भारी हिस्से को अलग file में रखता है जो बाद में उतरती
 * है। Preview में सब कुछ एक ही file में है, इसलिए यहाँ बस इतना करना है कि
 * component तभी बने जब browser तैयार हो (server पर नहीं) — वही काम
 * React.lazy + Suspense कर देते हैं।
 */

import { Suspense, lazy, type ComponentType, type ReactNode } from "react";

type Loader<P> = () => Promise<{ default: ComponentType<P> }>;

export default function dynamic<P extends object>(
  loader: Loader<P>,
  options?: { ssr?: boolean; loading?: () => ReactNode },
): ComponentType<P> {
  const Lazy = lazy(loader);
  const Fallback = options?.loading;

  return function Dynamic(props: P) {
    return (
      <Suspense fallback={Fallback ? <>{Fallback()}</> : null}>
        <Lazy {...props} />
      </Suspense>
    );
  };
}
