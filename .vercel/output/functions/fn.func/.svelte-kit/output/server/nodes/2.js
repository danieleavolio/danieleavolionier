

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.9b6fc50c.js","_app/immutable/chunks/scheduler.a5f99357.js","_app/immutable/chunks/index.0f8e246b.js"];
export const stylesheets = ["_app/immutable/assets/2.0ff0f93e.css"];
export const fonts = [];
