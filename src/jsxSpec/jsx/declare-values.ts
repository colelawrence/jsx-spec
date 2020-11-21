import { Observable } from "rxjs";

declare global {
  namespace JSX {
    type Value<T> = Observable<T | undefined> | T;
    type StringValue = Value<string>;
    type NumberValue = Value<number>;
    type BooleanValue = Value<boolean>;
    type DateValue = Value<Date>;
    type RefValue = (renderedSelf: HTMLElement) => any;
    type $StyleValue = Value<Partial<CSSStyleDeclaration>>;

    type AnyValue =
      | RefValue
      | $StyleValue
      | StringValue
      | NumberValue
      | BooleanValue
      | DateValue
      | ((this: any, event: Event) => any)
      | null;
  }
}
