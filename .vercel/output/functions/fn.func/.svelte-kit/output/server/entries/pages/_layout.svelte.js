import { c as create_ssr_component, e as escape, v as validate_component, a as subscribe } from "../../chunks/ssr.js";
import { t as title } from "../../chunks/config.js";
import { I as Icon } from "../../chunks/Icon.js";
import { w as writable } from "../../chunks/index2.js";
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
const Arrow_down_0_1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    ["path", { "d": "m3 16 4 4 4-4" }],
    ["path", { "d": "M7 20V4" }],
    [
      "rect",
      {
        "x": "15",
        "y": "4",
        "width": "4",
        "height": "6",
        "ry": "2"
      }
    ],
    ["path", { "d": "M17 20v-6h-2" }],
    ["path", { "d": "M15 20h4" }]
  ];
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "arrow-down-0-1" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const ArrowDown01 = Arrow_down_0_1;
const Settings = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "path",
      {
        "d": "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
      }
    ],
    ["circle", { "cx": "12", "cy": "12", "r": "3" }]
  ];
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "settings" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Settings$1 = Settings;
const isOpened = writable(false);
const header_svelte_svelte_type_style_lang = "";
const css$2 = {
  code: "a.svelte-hncc9j.svelte-hncc9j{color:inherit;text-decoration:none;height:fit-content}nav.svelte-hncc9j.svelte-hncc9j{display:flex;padding-block:var(--size-7);justify-content:space-between;position:relative}.links.svelte-hncc9j.svelte-hncc9j{margin-block:var(--size-7);display:flex;gap:var(--size-7);margin-block:0}li.svelte-hncc9j.svelte-hncc9j{background-image:none}.button-hamburger.svelte-hncc9j.svelte-hncc9j{right:100%;width:fit-content;cursor:pointer;transition:all 0.5s ease-in-out;z-index:3}.button-hamburger.svelte-hncc9j.svelte-hncc9j:hover{transform:rotate(90deg)}.hidden-menu.svelte-hncc9j.svelte-hncc9j{position:absolute;top:0;right:0;left:0;bottom:0;background-color:var(--automataBg);height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:var(--size-7);padding:1em;transition:all 0.5s ease-in-out;z-index:999}.hidden-menu.svelte-hncc9j a.svelte-hncc9j{width:90%}.close.svelte-hncc9j.svelte-hncc9j{position:absolute;bottom:2em;right:10px;padding:0.2em;opacity:0.7;transition:all 0.2s ease-in-out}.close.svelte-hncc9j.svelte-hncc9j:hover{opacity:1}@media(max-width: 800px){nav.svelte-hncc9j.svelte-hncc9j{justify-content:end}}",
  map: null
};
const Header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $isOpened, $$unsubscribe_isOpened;
  $$unsubscribe_isOpened = subscribe(isOpened, (value) => $isOpened = value);
  let width = 0;
  $$result.css.add(css$2);
  $$unsubscribe_isOpened();
  return ` <nav class="svelte-hncc9j"> ${` <div class="button-hamburger svelte-hncc9j">${validate_component(Settings$1, "Settings").$$render($$result, { "fill-opacity": "0", size: "2.5em" }, {}, {})}</div>`}</nav> ${$isOpened && width < 800 ? `<div class="hidden-menu svelte-hncc9j">  <div class="close svelte-hncc9j">${validate_component(ArrowDown01, "ArrowDown01").$$render(
    $$result,
    {
      cursor: "pointer",
      size: "3em",
      "fill-opacity": "0"
    },
    {},
    {}
  )}</div> <a href="/" class="svelte-hncc9j" data-svelte-h="svelte-7hipin">D.A</a> <a href="/pagine" class="svelte-hncc9j" data-svelte-h="svelte-17lisni">BLOG</a> <a href="/progetti" class="svelte-hncc9j" data-svelte-h="svelte-852dr0">PROJECTS</a> <a href="/data" class="svelte-hncc9j" data-svelte-h="svelte-jow4kg">DATA</a></div>` : ``}`;
});
const buttons_min = "";
const normalize_min = "";
const openProps_min = "";
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
  code: ".layout.svelte-1bmlo4o{height:100%;max-inline-size:1440px;display:grid;grid-template-rows:auto 1fr auto;margin-inline:auto;padding-inline:var(--size-7);position:relative;display:flex;flex-direction:column;justify-content:space-between;min-height:100vh}main.svelte-1bmlo4o{padding-block:var(--size-9)}@media(min-width: 1440px){.layout.svelte-1bmlo4o{padding-inline:0}}",
  map: null
};
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $isOpened, $$unsubscribe_isOpened;
  $$unsubscribe_isOpened = subscribe(isOpened, (value) => $isOpened = value);
  inject({ mode: "production" });
  let { data } = $$props;
  const document = typeof window !== "undefined" ? window.document : null;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css);
  {
    if (isOpened) {
      if (document != null)
        document.body.style.overflow = $isOpened ? "hidden" : "auto";
    }
  }
  $$unsubscribe_isOpened();
  return `<div class="layout svelte-1bmlo4o">${validate_component(Header, "Header").$$render($$result, {}, {}, {})} <main class="svelte-1bmlo4o">${validate_component(Transition, "PageTransition").$$render($$result, { url: data.url }, {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}</main> ${validate_component(Footer, "Footer").$$render($$result, {}, {}, {})} </div>`;
});
export {
  Layout as default
};
