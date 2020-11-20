import { Observable } from "rxjs";

export type Value<T> = Observable<T | undefined> | T;
export type StringValue = Value<string>;
export type NumberValue = Value<number>;
export type BooleanValue = Value<boolean>;
export type DateValue = Value<Date>;
export type RefValue = (renderedSelf: HTMLElement) => any;
export type $StyleValue = Value<Partial<CSSStyleDeclaration>>;

export type AnyValue =
  | RefValue
  | $StyleValue
  | StringValue
  | NumberValue
  | BooleanValue
  | DateValue
  | ((this: any, event: Event) => any)
  | null;
