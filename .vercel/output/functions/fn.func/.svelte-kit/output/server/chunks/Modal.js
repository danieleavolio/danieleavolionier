import { c as create_ssr_component, d as add_attribute } from "./ssr.js";
const Modal_svelte_svelte_type_style_lang = "";
const css = {
  code: "dialog.svelte-1egqj1q.svelte-1egqj1q{border-radius:0.2em;border:none;padding:2em}.search.svelte-1egqj1q.svelte-1egqj1q{padding:1em;width:80%;min-height:80%;flex-direction:column;justify-content:space-evenly;transition:all 0.3s}.internal.svelte-1egqj1q.svelte-1egqj1q{display:flex;flex-direction:column;justify-content:space-evenly;height:100%}dialog.svelte-1egqj1q.svelte-1egqj1q::backdrop{background:rgba(0, 0, 0, 0.3)}dialog.svelte-1egqj1q>div.svelte-1egqj1q{padding:1em}dialog[open].svelte-1egqj1q.svelte-1egqj1q{animation:svelte-1egqj1q-zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)}@keyframes svelte-1egqj1q-zoom{from{transform:scale(0.95)}to{transform:scale(1)}}dialog[open].svelte-1egqj1q.svelte-1egqj1q::backdrop{animation:svelte-1egqj1q-fade 0.2s ease-out}@keyframes svelte-1egqj1q-fade{from{opacity:0}to{opacity:1}}a.svelte-1egqj1q.svelte-1egqj1q{display:block;margin:auto}",
  map: null
};
const Modal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { showModal } = $$props;
  let { isSearch = false } = $$props;
  let { dialog = 0 } = $$props;
  if ($$props.showModal === void 0 && $$bindings.showModal && showModal !== void 0)
    $$bindings.showModal(showModal);
  if ($$props.isSearch === void 0 && $$bindings.isSearch && isSearch !== void 0)
    $$bindings.isSearch(isSearch);
  if ($$props.dialog === void 0 && $$bindings.dialog && dialog !== void 0)
    $$bindings.dialog(dialog);
  $$result.css.add(css);
  {
    if (dialog && showModal) {
      dialog.showModal();
      dialog.scrollTop = 0;
    }
  }
  return ` <dialog class="${["svelte-1egqj1q", isSearch ? "search" : ""].join(" ").trim()}"${add_attribute("this", dialog, 0)}> <div class="internal svelte-1egqj1q">${slots.header ? slots.header({}) : ``} ${slots.default ? slots.default({ class: "internal svelte-1egqj1q" }) : ``}    <a autofocus class="svelte-1egqj1q" data-svelte-h="svelte-1xniscw">CHIUDI</a></div> </dialog>`;
});
export {
  Modal as M
};
