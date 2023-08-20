

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.0b673e42.js","_app/immutable/chunks/scheduler.57811b04.js","_app/immutable/chunks/index.bffac608.js","_app/immutable/chunks/singletons.a6faa154.js"];
export const stylesheets = ["_app/immutable/assets/1.f870a4f1.css"];
export const fonts = [];
