

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.c39e0aca.js","_app/immutable/chunks/scheduler.ef8ee926.js","_app/immutable/chunks/index.97c34b88.js","_app/immutable/chunks/singletons.94c5f608.js"];
export const stylesheets = ["_app/immutable/assets/1.f870a4f1.css"];
export const fonts = [];
