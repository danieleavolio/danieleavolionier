

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.997e4987.js","_app/immutable/chunks/scheduler.eca58bb1.js","_app/immutable/chunks/index.4250a4ca.js","_app/immutable/chunks/stores.233b9c1d.js","_app/immutable/chunks/singletons.7194d323.js"];
export const stylesheets = ["_app/immutable/assets/1.f870a4f1.css"];
export const fonts = [];
