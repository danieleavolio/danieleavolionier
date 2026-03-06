import * as server from '../entries/pages/admin/stack/_page.server.ts.js';

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/stack/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/stack/+page.server.ts";
export const imports = ["_app/immutable/nodes/8.5554c1f4.js","_app/immutable/chunks/scheduler.a5f99357.js","_app/immutable/chunks/index.0f8e246b.js","_app/immutable/chunks/each.2b167411.js","_app/immutable/chunks/forms.0f3ec8a2.js","_app/immutable/chunks/parse.bee59afc.js","_app/immutable/chunks/singletons.35336ced.js","_app/immutable/chunks/navigation.a2151437.js","_app/immutable/chunks/index.22c841e0.js"];
export const stylesheets = [];
export const fonts = [];
