import { c as create_ssr_component, e as escape, v as validate_component } from "../../chunks/ssr.js";
import { t as title } from "../../chunks/config.js";
import { inject } from "@vercel/analytics";
const footer_svelte_svelte_type_style_lang = "";
const css$3 = {
  code: "footer.svelte-k2ae0s{padding-block:var(--size-7);border-top:1px solid var(--border)}p.svelte-k2ae0s{color:var(--text-2)}",
  map: null
};
const Footer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$3);
  return `<footer class="svelte-k2ae0s"><p class="svelte-k2ae0s">${escape(title)} © ${escape((/* @__PURE__ */ new Date()).getFullYear())}</p> </footer>`;
});
const header_svelte_svelte_type_style_lang = "";
const css$2 = {
  code: "a.svelte-xbv2un{color:inherit;text-decoration:none;height:fit-content}nav.svelte-xbv2un{display:flex;padding-block:var(--size-7);justify-content:space-between}.links.svelte-xbv2un{margin-block:var(--size-7);display:flex;gap:var(--size-7);margin-block:0}li.svelte-xbv2un{background-image:none}",
  map: null
};
const Header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$2);
  return `<nav class="svelte-xbv2un"><a href="/" class="title svelte-xbv2un"><b>${escape(title)}</b></a> <ul class="links svelte-xbv2un" data-svelte-h="svelte-pt10py"><li class="svelte-xbv2un"><a href="/about" class="svelte-xbv2un">About</a></li></ul> </nav>`;
});
const openProps_min = "";
const normalize_min = "";
const buttons_min = "";
const app = "";
const transition_svelte_svelte_type_style_lang = "";
const css$1 = {
  code: ".transition.svelte-vcdv4c{height:100%}",
  map: null
};
const Transition = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { url } = $$props;
  if ($$props.url === void 0 && $$bindings.url && url !== void 0)
    $$bindings.url(url);
  $$result.css.add(css$1);
  return `<div class="transition svelte-vcdv4c">${slots.default ? slots.default({}) : ``}</div>`;
});
const _layout_svelte_svelte_type_style_lang = "";
const css = {
  code: ".layout.svelte-18vyp62{height:100%;max-inline-size:1440px;display:grid;grid-template-rows:auto 1fr auto;margin-inline:auto;padding-inline:var(--size-7);display:flex;flex-direction:column;justify-content:space-between;min-height:100vh}main.svelte-18vyp62{padding-block:var(--size-9)}@media(min-width: 1440px){.layout.svelte-18vyp62{padding-inline:0}}",
  map: null
};
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  inject({ mode: "production" });
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css);
  return `<div class="layout svelte-18vyp62">${validate_component(Header, "Header").$$render($$result, {}, {}, {})} <main class="svelte-18vyp62">${validate_component(Transition, "PageTransition").$$render($$result, { url: data.url }, {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}</main> ${validate_component(Footer, "Footer").$$render($$result, {}, {}, {})} </div>`;
});
export {
  Layout as default
};
