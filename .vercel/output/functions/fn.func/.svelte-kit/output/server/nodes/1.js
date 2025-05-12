

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.ede0c6c9.js","_app/immutable/chunks/scheduler.95a0eae5.js","_app/immutable/chunks/index.92efbcc7.js","_app/immutable/chunks/stores.612511a9.js","_app/immutable/chunks/singletons.f10ad86e.js"];
export const stylesheets = ["_app/immutable/assets/1.f870a4f1.css"];
export const fonts = [];
