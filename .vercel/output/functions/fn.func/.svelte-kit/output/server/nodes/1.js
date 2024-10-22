

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.45c8d6fa.js","_app/immutable/chunks/scheduler.38e9bcec.js","_app/immutable/chunks/index.fa6e9378.js","_app/immutable/chunks/stores.b96cbf1f.js","_app/immutable/chunks/singletons.79a72569.js"];
export const stylesheets = ["_app/immutable/assets/1.f870a4f1.css"];
export const fonts = [];
