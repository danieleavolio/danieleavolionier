

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.dccb5e9a.js","_app/immutable/chunks/scheduler.95a0eae5.js","_app/immutable/chunks/index.92efbcc7.js","_app/immutable/chunks/stores.7ec5c7ea.js","_app/immutable/chunks/singletons.6c8fe1bf.js"];
export const stylesheets = ["_app/immutable/assets/1.f870a4f1.css"];
export const fonts = [];
