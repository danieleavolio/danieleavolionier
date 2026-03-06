import { c as create_ssr_component } from "../../../chunks/ssr.js";
const _layout_svelte_svelte_type_style_lang = "";
const css = {
  code: ".admin-layout.svelte-wepm9m.svelte-wepm9m{display:flex}.sidebar.svelte-wepm9m.svelte-wepm9m{width:200px;background-color:var(--automataBg);padding:1rem;border-right:1px solid var(--automataColor)}nav.svelte-wepm9m ul.svelte-wepm9m{list-style:none;padding:0}nav.svelte-wepm9m li.svelte-wepm9m{margin-bottom:1rem}nav.svelte-wepm9m a.svelte-wepm9m{text-decoration:none;color:var(--automataColor)}.main-content.svelte-wepm9m.svelte-wepm9m{flex:1;padding:1rem}",
  map: null
};
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<div class="admin-layout svelte-wepm9m"><aside class="sidebar svelte-wepm9m" data-svelte-h="svelte-kfvxbx"><nav class="svelte-wepm9m"><ul class="svelte-wepm9m"><li class="svelte-wepm9m"><a href="/admin/posts" class="svelte-wepm9m">Posts</a></li> <li class="svelte-wepm9m"><a href="/admin/projects" class="svelte-wepm9m">Projects</a></li> <li class="svelte-wepm9m"><a href="/admin/stack" class="svelte-wepm9m">Stack</a></li></ul></nav></aside> <main class="main-content svelte-wepm9m">${slots.default ? slots.default({}) : ``}</main> </div>`;
});
export {
  Layout as default
};
