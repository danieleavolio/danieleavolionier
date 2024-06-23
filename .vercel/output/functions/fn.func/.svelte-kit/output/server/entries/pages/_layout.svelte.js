import { c as create_ssr_component, e as escape, v as validate_component, a as subscribe } from "../../chunks/ssr.js";
import { t as title } from "../../chunks/config.js";
import { I as Icon } from "../../chunks/Icon.js";
import { w as writable } from "../../chunks/index2.js";
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
const Home = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "path",
      {
        "d": "m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
      }
    ],
    ["polyline", { "points": "9 22 9 12 15 12 15 22" }]
  ];
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "home" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Home$1 = Home;
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
  code: "a.svelte-1chnx4l.svelte-1chnx4l{color:inherit;text-decoration:none;height:fit-content}a.svelte-1chnx4l.svelte-1chnx4l::after{content:'';background-image:url('https://i.imgur.com/h8f3hwW.png');background-size:contain;background-repeat:no-repeat}nav.svelte-1chnx4l.svelte-1chnx4l{display:flex;flex-direction:column;padding-block:var(--size-7);justify-content:space-between;top:0;z-index:999}nav.svelte-1chnx4l.svelte-1chnx4l::after{content:'';width:100%;height:30px;background-image:url('https://i.imgur.com/FMYB47Q.png');background-size:contain;background-repeat:repeat}.nav-div.svelte-1chnx4l.svelte-1chnx4l{display:flex;justify-content:space-between}.links.svelte-1chnx4l.svelte-1chnx4l{margin-block:var(--size-7);display:flex;gap:var(--size-7);margin-block:0}li.svelte-1chnx4l.svelte-1chnx4l{background-image:none;padding-bottom:0;margin-bottom:0}.button-hamburger.svelte-1chnx4l.svelte-1chnx4l{right:100%;width:fit-content;cursor:pointer;transition:all 0.5s ease-in-out;z-index:3}.button-hamburger.svelte-1chnx4l.svelte-1chnx4l:hover{transform:rotate(90deg)}.hidden-menu.svelte-1chnx4l.svelte-1chnx4l{position:absolute;top:0;right:0;left:0;bottom:0;background-color:var(--automataBg);height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:var(--size-7);padding:1em;transition:all 0.5s ease-in-out;z-index:999}.hidden-menu.svelte-1chnx4l a.svelte-1chnx4l{width:90%}.close.svelte-1chnx4l.svelte-1chnx4l{position:absolute;bottom:3rem;right:10px;padding:0.2em;opacity:0.7;transition:all 0.2s ease-in-out}.close.svelte-1chnx4l.svelte-1chnx4l:hover{opacity:1}.home.svelte-1chnx4l.svelte-1chnx4l{opacity:0.7;transition:all 0.3s ease-in-out}.home.svelte-1chnx4l.svelte-1chnx4l:hover{opacity:1;transform:rotate(-90deg)}@media(max-width: 800){nav.svelte-1chnx4l.svelte-1chnx4l{justify-content:space-between;position:sticky}}",
  map: null
};
const Header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $isOpened, $$unsubscribe_isOpened;
  $$unsubscribe_isOpened = subscribe(isOpened, (value) => $isOpened = value);
  let width = 0;
  $$result.css.add(css$2);
  $$unsubscribe_isOpened();
  return ` <nav class="svelte-1chnx4l"><div class="nav-div svelte-1chnx4l"> ${` <div class="home svelte-1chnx4l">${validate_component(Home$1, "Home").$$render(
    $$result,
    {
      cursor: "pointer",
      "fill-opacity": "0",
      size: "2.5em"
    },
    {},
    {}
  )}</div>  <div class="button-hamburger svelte-1chnx4l">${validate_component(Settings$1, "Settings").$$render($$result, { "fill-opacity": "0", size: "2.5em" }, {}, {})}</div>`}</div></nav> ${$isOpened && width < 1300 ? `<div class="hidden-menu svelte-1chnx4l">  <div class="close svelte-1chnx4l">${validate_component(ArrowDown01, "ArrowDown01").$$render(
    $$result,
    {
      cursor: "pointer",
      size: "3em",
      "fill-opacity": "0"
    },
    {},
    {}
  )}</div> <a href="/" class="svelte-1chnx4l" data-svelte-h="svelte-7hipin">D.A</a> <a href="/pagine" class="svelte-1chnx4l" data-svelte-h="svelte-17lisni">BLOG</a> <a href="/progetti" class="svelte-1chnx4l" data-svelte-h="svelte-sm6bm8">PROGETTI</a> <a href="/data" class="svelte-1chnx4l" data-svelte-h="svelte-jow4kg">DATA</a> <a href="/appunti" class="svelte-1chnx4l" data-svelte-h="svelte-1yx08mu">APPUNTI</a></div>` : ``}`;
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
  code: ".layout.svelte-yzgd0o{height:100%;max-inline-size:1440px;display:grid;grid-template-rows:auto 1fr auto;margin-inline:auto;padding-inline:var(--size-7);position:relative;display:flex;flex-direction:column;justify-content:space-between;min-height:100vh}main.svelte-yzgd0o{padding-block:var(--size-9)}@media(min-width: 1440px){.layout.svelte-yzgd0o{padding-inline:0}}",
  map: null
};
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $isOpened, $$unsubscribe_isOpened;
  $$unsubscribe_isOpened = subscribe(isOpened, (value) => $isOpened = value);
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
  return `<div class="layout svelte-yzgd0o">${validate_component(Header, "Header").$$render($$result, {}, {}, {})} <main class="svelte-yzgd0o">${validate_component(Transition, "PageTransition").$$render($$result, { url: data.url }, {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}</main> ${validate_component(Footer, "Footer").$$render($$result, {}, {}, {})} </div>`;
});
export {
  Layout as default
};
