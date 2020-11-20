import { h, renderSpec } from "./jsxSpec";
import { BehaviorSubject } from "rxjs";

const $name = new BehaviorSubject("world");

const render = renderSpec(
  <div
    ref={(a) =>
      setTimeout(() => console.log("div ref", a.outerHTML, a.offsetWidth), 0)
    }
  >
    <SuperLabel name={$name}></SuperLabel>
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

function SuperLabel({ name }) {
  return <label>{name}🔦</label>;
}
