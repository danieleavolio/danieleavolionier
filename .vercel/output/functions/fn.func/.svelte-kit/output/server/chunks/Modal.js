import { c as create_ssr_component, d as add_attribute } from "./ssr.js";
const Modal_svelte_svelte_type_style_lang = "";
const css = {
  code: "dialog.svelte-9sq2pw.svelte-9sq2pw{border-radius:0.2em;border:none;padding:2em}.search.svelte-9sq2pw.svelte-9sq2pw{padding:1em;width:80%;min-height:80%;flex-direction:column;justify-content:space-evenly;transition:all 0.3s}.internal.svelte-9sq2pw.svelte-9sq2pw{display:flex;flex-direction:column;justify-content:space-evenly;height:100%}dialog.svelte-9sq2pw.svelte-9sq2pw::backdrop{background:rgba(0, 0, 0, 0.3)}dialog.svelte-9sq2pw>div.svelte-9sq2pw{padding:1em}dialog[open].svelte-9sq2pw.svelte-9sq2pw{animation:svelte-9sq2pw-zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)}@keyframes svelte-9sq2pw-zoom{from{transform:scale(0.95)}to{transform:scale(1)}}dialog[open].svelte-9sq2pw.svelte-9sq2pw::backdrop{animation:svelte-9sq2pw-fade 0.2s ease-out}@keyframes svelte-9sq2pw-fade{from{opacity:0}to{opacity:1}}a.svelte-9sq2pw.svelte-9sq2pw{display:block;margin:auto}",
  map: null
};
const Modal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { showModal } = $$props;
  let { isSearch = false } = $$props;
  let { dialog } = $$props;
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
  return ` <dialog class="${["svelte-9sq2pw", isSearch ? "search" : ""].join(" ").trim()}"${add_attribute("this", dialog, 0)}> <div class="internal svelte-9sq2pw">${slots.header ? slots.header({}) : ``} ${slots.default ? slots.default({ class: "internal svelte-9sq2pw" }) : ``}    <a autofocus class="svelte-9sq2pw" data-svelte-h="svelte-1xniscw">CHIUDI</a></div> </dialog>`;
});
export {
  Modal as M
};
