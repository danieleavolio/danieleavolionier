import { c as create_ssr_component, d as add_attribute } from "../../../../chunks/ssr.js";
import "devalue";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  let { form } = $$props;
  let password = "";
  let stackElements = data.stackElements;
  data.stackElementContents;
  stackElements[0];
  [...new Set(stackElements.map((el) => el.color))];
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  if ($$props.form === void 0 && $$bindings.form && form !== void 0)
    $$bindings.form(form);
  return `<div class="editor-container">${`<div class="login-container"><h1 data-svelte-h="svelte-12b6bm">Accesso Amministratore</h1> <form><label for="password" data-svelte-h="svelte-pepa0a">Password</label> <input type="password" id="password" required${add_attribute("value", password, 0)}> <button type="submit" data-svelte-h="svelte-1njcxaz">Entra</button></form> ${``}</div>`}</div>`;
});
export {
  Page as default
};
