// mark as a module for TypeScript
export default {};

type NonNullableValues<T> = { [P in keyof T]-?: NonNullable<T[P]> };
type EventOnListeners = NonNullableValues<
  Omit<GlobalEventHandlers, "addEventListener" | "removeEventListener">
>;

// Fixes "this" binding to the actual HTMLElement type which the event is emitted from
type EventPropsWithThisElement<
  T
> = {
  // prettier-ignore
  [P in keyof EventOnListeners]:
    Parameters<EventOnListeners[P]> extends [infer E]
      ? (this: T, event: E) => any | null
      : EventOnListeners[P];
};

declare global {
  namespace JSX {
    interface HtmlProps<T extends HTMLElement = HTMLElement>
      extends Partial<EventPropsWithThisElement<T>> {}
  }
}
