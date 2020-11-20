import { $StyleValue } from "./prop-values";

declare global {
  namespace JSX {
    interface HtmlProps<T extends HTMLElement = HTMLElement> {
      /**
       * Assign individual style properties with each emit.
       * For performance reasons, we do not track "unset" values,
       * so if you do `.next({ top: "2px" })` and then `.next({})`, the
       * style will still include `top: 2px`. This makes performance
       * predicatable for animation, and it ensures compatibility with
       * an added "style" property (as long as the style property isn't
       * also an observable).
       */
      $style?: $StyleValue;
      /** Access the current element after the element has been created with children (but before being mounted) */
      ref?: (element: T) => void;
    }
  }
}
