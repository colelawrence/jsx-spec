import { isObservable, Observable, Subscription } from "rxjs";
import { DOMOutputSpec, DOMOutputSpecArray, DOMSpecElement } from "./h";

export function renderSpec(
  structure: DOMSpecElement
): {
  dom: HTMLElement;
  subscription?: Subscription;
} {
  return renderSpecDoc(document, structure);
}

const booleanProps = new Set([
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "defer",
  "disabled",
  "draggable",
  "hidden",
  "loop",
  "multiple",
  "novalidate",
  "open",
  "readonly",
  "required",
  "reversed",
  "scoped",
  "selected",
  "spellcheck",
  "wrap",
]);

/**
 * :: (dom.Document, DOMOutputSpec) → {dom: dom.Node, contentDOM: ?dom.Node}
 * Render an [output spec](#model.DOMOutputSpec) to a DOM node. If
 * the spec has a hole (zero) in it, `contentDOM` will point at the
 * node with the hole.
 *
 * * **Modified to work with event listeners see `else if (name.startsWith("on"))`**
 * * **Modified to work with observables on attribute setters see `else if (name.startsWith("on"))`**
 * * **Modified to work with `ref` attributes**
 */
function renderSpecDoc(
  doc: Document,
  structure: DOMOutputSpec
): {
  dom: any;
  subscription?: Subscription;
} {
  if (structure instanceof DOMSpecElement)
    structure = structure.spec as
      | string
      | Node
      | DOMOutputSpecArray
      | Observable<DOMOutputSpec>;

  if (typeof structure === "string")
    return { dom: doc.createTextNode(structure) };
  const sub = new Subscription();
  if (isObservable<DOMOutputSpec>(structure)) {
    let wrappedNode = document.createTextNode("");
    let { dom: wrappedDom } = renderSpecDoc(doc, [
      "render-observable",
      null,
      wrappedNode,
    ]);
    let wrappedSub: Subscription | undefined = undefined;
    sub.add(
      structure.subscribe((spec) => {
        const oldNode = wrappedNode;
        const rendered = renderSpecDoc(doc, spec as DOMOutputSpec); // should fail if node
        wrappedNode = rendered.dom;
        oldNode.replaceWith(wrappedNode);
        if (wrappedSub) {
          // remove sub from sub list
          sub.remove(wrappedSub);
          // unsubscribe as the old element has been removed from the doc
          wrappedSub.unsubscribe();
        }
        wrappedSub = rendered.subscription;
        if (wrappedSub) {
          sub.add(wrappedSub);
        }
      })
    );
    return { dom: wrappedDom, subscription: sub };
  }
  if (structure["nodeType"] != null) return { dom: structure as Node };
  const tagName = structure[0];
  if (tagName.indexOf(" ") > 0) {
    throw new RangeError(`Unexpected space in tagName ("${tagName}")`);
  }
  const dom = doc.createElement(tagName) as HTMLElement;
  const attrs = structure[1];
  let ref: (
    self: HTMLElement,
    sub: Subscription
  ) => any | undefined = undefined;
  if (attrs != null) {
    for (let name in attrs) {
      const attrVal = attrs[name];
      const directAssign = name.startsWith("on") || booleanProps.has(name);
      if (attrVal != null) {
        if (isObservable(attrVal)) {
          if (name === "$style") {
            if (isObservable(attrs.style))
              throw new RangeError(
                "Cannot combine style$ property with an Observable [style] property."
              );
            sub.add(
              attrVal.subscribe((value) => {
                Object.assign(dom.style, value);
              })
            );
          } else if (directAssign) {
            sub.add(
              attrVal.subscribe((value) => {
                if (dom[name] !== value) dom[name] = value;
              })
            );
          } else
            sub.add(
              attrVal.subscribe((value) => {
                if (value == null) dom.removeAttribute(name);
                else dom.setAttribute(name, String(value));
              })
            );
        } else if (attrVal != null) {
          // Storyscript specific change to enable event listeners and boolean props
          if (directAssign) {
            dom[name] = attrVal;
          } else if (name === "ref") {
            ref = attrVal;
          } else dom.setAttribute(name, attrVal);
        }
      }
    }
  }
  // @ts-ignore
  for (let i = 2; i < structure.length; i++) {
    let child = structure[i];
    const { dom: inner, subscription } = renderSpecDoc(doc, child);
    if (subscription) sub.add(subscription);
    dom.appendChild(inner);
  }
  ref?.(dom, sub);
  return { dom, subscription: sub };
}
