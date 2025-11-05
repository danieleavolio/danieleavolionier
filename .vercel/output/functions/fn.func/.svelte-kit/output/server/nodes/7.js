import * as server from '../entries/pages/admin/projects/_page.server.ts.js';

export const index = 7;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/projects/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/projects/+page.server.ts";
export const imports = ["_app/immutable/nodes/7.24f60a22.js","_app/immutable/chunks/scheduler.a5f99357.js","_app/immutable/chunks/index.0f8e246b.js","_app/immutable/chunks/each.2b167411.js","_app/immutable/chunks/forms.64b184e1.js","_app/immutable/chunks/parse.bee59afc.js","_app/immutable/chunks/singletons.c5688067.js","_app/immutable/chunks/navigation.9c9aa4c2.js","_app/immutable/chunks/index.22c841e0.js"];
export const stylesheets = ["_app/immutable/assets/7.411bcb6a.css"];
export const fonts = [];
