

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.c4c7abae.js","_app/immutable/chunks/scheduler.38e9bcec.js","_app/immutable/chunks/index.fa6e9378.js","_app/immutable/chunks/stores.8d13919e.js","_app/immutable/chunks/singletons.eb0e3063.js"];
export const stylesheets = ["_app/immutable/assets/1.f870a4f1.css"];
export const fonts = [];
