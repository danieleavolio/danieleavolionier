

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.dd87a6c6.js","_app/immutable/chunks/scheduler.eca58bb1.js","_app/immutable/chunks/index.4250a4ca.js","_app/immutable/chunks/stores.a334303b.js","_app/immutable/chunks/singletons.470acd45.js"];
export const stylesheets = ["_app/immutable/assets/1.f870a4f1.css"];
export const fonts = [];
