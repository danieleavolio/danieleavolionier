import { c as create_ssr_component, d as add_attribute } from "../../../../chunks/ssr.js";
import "devalue";
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: ".admin-container.svelte-1gf8zr6.svelte-1gf8zr6{display:grid;grid-template-columns:300px 1fr;gap:1rem;padding:1rem}.login-container.svelte-1gf8zr6.svelte-1gf8zr6{grid-column:1 / -1;text-align:center}.project-list.svelte-1gf8zr6.svelte-1gf8zr6{border-right:1px solid var(--automataColor);padding-right:1rem}.project-list.svelte-1gf8zr6 ul.svelte-1gf8zr6{list-style:none;padding:0;margin-top:1rem}.project-list.svelte-1gf8zr6 li.svelte-1gf8zr6{margin-bottom:0.5rem;cursor:pointer;padding:0.5rem;border-radius:4px}.project-list.svelte-1gf8zr6 li.svelte-1gf8zr6:hover{background-color:var(--automataBgRGBA)}.editor-grid.svelte-1gf8zr6.svelte-1gf8zr6{display:grid;grid-template-columns:1fr 1fr;gap:1rem}form.svelte-1gf8zr6.svelte-1gf8zr6{display:flex;flex-direction:column;gap:0.5rem}label.svelte-1gf8zr6.svelte-1gf8zr6{font-weight:bold;text-transform:uppercase;font-size:0.9rem}input.svelte-1gf8zr6.svelte-1gf8zr6,textarea.svelte-1gf8zr6.svelte-1gf8zr6{padding:0.5rem;border:1px solid var(--automataColor);border-radius:0;background-color:var(--automataBg);color:var(--automataColor);font-family:var(--font-mono)}textarea.svelte-1gf8zr6.svelte-1gf8zr6{resize:vertical}button.svelte-1gf8zr6.svelte-1gf8zr6{text-transform:uppercase;font-weight:300;letter-spacing:0.3rem;text-shadow:0.2rem 0.2rem 0 rgba(77, 73, 62, 0.3);cursor:pointer;font:inherit;border:none;padding:0.4rem 1rem;background-color:var(--automataBgRGBA);color:var(--automataColor);box-sizing:content-box;position:relative;border:1px solid transparent;border-left:none;border-right:none;transition:all 0.1s ease-in-out;text-align:center;margin-top:1rem}button.svelte-1gf8zr6.svelte-1gf8zr6:hover,button.svelte-1gf8zr6.svelte-1gf8zr6:focus{background-color:var(--automataColor);color:var(--automataBg) !important;border-color:var(--automataColor);text-decoration:none}.response-message.svelte-1gf8zr6.svelte-1gf8zr6{margin-top:1rem;padding:1rem;border-radius:4px;background-color:#f0f0f0}.toast.svelte-1gf8zr6.svelte-1gf8zr6{position:fixed;top:20px;right:20px;background-color:var(--automataRed);color:var(--automataWhite);padding:1rem;border-radius:5px;box-shadow:0 2px 10px rgba(0, 0, 0, 0.1)}.preview-container.svelte-1gf8zr6.svelte-1gf8zr6{padding:1rem;border:1px solid var(--automataColor);background-color:var(--automataBg)}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  let { form } = $$props;
  let password = "";
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  if ($$props.form === void 0 && $$bindings.form && form !== void 0)
    $$bindings.form(form);
  $$result.css.add(css);
  return `${$$result.head += `<!-- HEAD_svelte-kfoqwy_START --><script src="https://cdn.jsdelivr.net/npm/marked/lib/marked.umd.js" data-svelte-h="svelte-92bq6a"><\/script><!-- HEAD_svelte-kfoqwy_END -->`, ""}  <div class="admin-container svelte-1gf8zr6">${`<div class="login-container svelte-1gf8zr6"><h1 data-svelte-h="svelte-12b6bm">Accesso Amministratore</h1> <form class="svelte-1gf8zr6"><label for="password" class="svelte-1gf8zr6" data-svelte-h="svelte-pepa0a">Password</label> <input type="password" id="password" required class="svelte-1gf8zr6"${add_attribute("value", password, 0)}> <button type="submit" class="svelte-1gf8zr6" data-svelte-h="svelte-1njcxaz">Entra</button></form> ${``}</div>`} </div>`;
});
export {
  Page as default
};
