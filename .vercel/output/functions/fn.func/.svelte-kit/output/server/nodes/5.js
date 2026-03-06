import * as server from '../entries/pages/admin/editor/_page.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/editor/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/editor/+page.server.ts";
export const imports = ["_app/immutable/nodes/5.c2facf09.js","_app/immutable/chunks/scheduler.a5f99357.js","_app/immutable/chunks/index.0f8e246b.js","_app/immutable/chunks/forms.0f3ec8a2.js","_app/immutable/chunks/parse.bee59afc.js","_app/immutable/chunks/singletons.35336ced.js","_app/immutable/chunks/navigation.a2151437.js","_app/immutable/chunks/index.22c841e0.js"];
export const stylesheets = ["_app/immutable/assets/5.b63a8aeb.css"];
export const fonts = [];
