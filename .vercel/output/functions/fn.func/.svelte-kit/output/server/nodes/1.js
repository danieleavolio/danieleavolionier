

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.a2b2d049.js","_app/immutable/chunks/scheduler.eca58bb1.js","_app/immutable/chunks/index.4250a4ca.js","_app/immutable/chunks/stores.7565a43c.js","_app/immutable/chunks/singletons.80baae1a.js"];
export const stylesheets = ["_app/immutable/assets/1.f870a4f1.css"];
export const fonts = [];
