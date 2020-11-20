import { Observable } from "rxjs";

export function h(
  elemName: string | ((props: any, ...children: JSX.Element[]) => JSX.Element),
  props: Record<string, string> | null,
  // JSX TypeScript allows all sorts of interpolatable info as expressions including numbers by default
  // I'm not sure if it's possible to overwrite what is allowed to be in these expressions, so we have
  // to fix the children before passing along to `renderSpec`.
  ...children: any[]
): JSX.Element {
  const fixChildren: JSX.Element[] = flattenChildren(...children);
  if (typeof elemName === "string")
    return new DOMSpecElement([elemName, props, ...fixChildren]);
  else return elemName(props, ...fixChildren) as any;
}

function flattenChildren(
  ...children: (
    | string
    | number
    | JSX.Element
    | (string | number | JSX.Element)[]
  )[]
): JSX.Element[] {
  return Array.from(children).flatMap((a) => {
    if (a instanceof DOMSpecElement) return a;
    if (typeof a === "string") {
      return new DOMSpecElement(a);
    } else if (a instanceof Array) {
      return flattenChildren(...a);
    } else {
      return new DOMSpecElement(typeof a === "number" ? String(a) : a);
    }
  });
}

declare global {
  namespace JSX {
    // Element has to be its own type in order to support flattening a problem child like: ["Hello", ["div", "World"]] in JSX
    type Element = DOMSpecElement;
  }
}

export type RenderedSpec = { dom: Node; contentDOM?: Node | null };

export type DOMIntrinsicAttrs = JSX.AnyProps;

export interface DOMOutputSpecArray {
  0: string;
  1?: (JSX.HtmlProps & DOMIntrinsicAttrs) | null;
  2?: DOMOutputSpec | 0;
  3?: DOMOutputSpec | 0;
  4?: DOMOutputSpec | 0;
  5?: DOMOutputSpec | 0;
  6?: DOMOutputSpec | 0;
  7?: DOMOutputSpec | 0;
  8?: DOMOutputSpec | 0;
  9?: DOMOutputSpec | 0;
}

export type DOMOutputSpec =
  | string
  | Node
  | DOMOutputSpecArray
  | Observable<DOMOutputSpec>
  | DOMSpecElement;

export class DOMSpecElement {
  constructor(
    public readonly spec:
      | string
      | Node
      | DOMOutputSpecArray
      | Observable<DOMOutputSpec>
  ) {}
}
