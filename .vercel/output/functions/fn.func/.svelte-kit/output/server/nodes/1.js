

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.da160048.js","_app/immutable/chunks/scheduler.07cd7106.js","_app/immutable/chunks/index.b7d84411.js","_app/immutable/chunks/singletons.50ac9773.js"];
export const stylesheets = ["_app/immutable/assets/1.f870a4f1.css"];
export const fonts = [];
