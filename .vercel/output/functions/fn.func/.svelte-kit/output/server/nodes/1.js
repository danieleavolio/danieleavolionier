

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.b86592b0.js","_app/immutable/chunks/scheduler.95a0eae5.js","_app/immutable/chunks/index.92efbcc7.js","_app/immutable/chunks/stores.f7208963.js","_app/immutable/chunks/singletons.e3133b87.js"];
export const stylesheets = ["_app/immutable/assets/1.f870a4f1.css"];
export const fonts = [];
