# jsx-spec

An RxJS-centric HTML UI templating library!

```typescript
import { h, renderSpec } from "./jsxSpec";
import { BehaviorSubject } from "rxjs";

const $name = new BehaviorSubject("world");

const render = renderSpec(
  <div
    // Grab a reference of this element (before mounting)
    ref={(a) =>
      setTimeout(() => console.log("div ref", a.outerHTML, a.offsetWidth), 0)
    }
  >
    <h1>JSX Spec demo</h1>
    <SuperLabel name={$name} class="golden"></SuperLabel>
    <br />
    <input
      ref={console.log.bind(console, "ref")}
      oninput={onInputValue((updatedValue) => $name.next(updatedValue))}
      value={$name}
    />
  </div>
);

/** Helper for use with `oninput` prop */
function onInputValue(then: (value: string) => any) {
  return function (this: HTMLInputElement | HTMLTextAreaElement) {
    return then(this.value);
  };
}

document.body.append(render.dom);

// Example of how to get the props of a component function
type SuperLabelProps = JSX.Props<typeof SuperLabel>;

/** Component allowing you to pass props to the "label" HTMLElement */
function SuperLabel({
  name,
  ...labelProps
}: {
  name: JSX.StringValue;
} & JSX.HtmlLabelProps) {
  return <label {...labelProps}>{name}🔦</label>;
}
```
