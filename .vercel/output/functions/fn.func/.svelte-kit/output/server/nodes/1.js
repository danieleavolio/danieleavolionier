

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.51bfe3ca.js","_app/immutable/chunks/scheduler.95a0eae5.js","_app/immutable/chunks/index.92efbcc7.js","_app/immutable/chunks/stores.6196207c.js","_app/immutable/chunks/singletons.2932b8e4.js"];
export const stylesheets = ["_app/immutable/assets/1.f870a4f1.css"];
export const fonts = [];
