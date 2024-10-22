

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.77a33053.js","_app/immutable/chunks/scheduler.38e9bcec.js","_app/immutable/chunks/index.e37b2c25.js","_app/immutable/chunks/stores.d275db03.js","_app/immutable/chunks/singletons.d0489171.js"];
export const stylesheets = ["_app/immutable/assets/1.f870a4f1.css"];
export const fonts = [];
