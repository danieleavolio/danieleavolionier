

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.8a7d3809.js","_app/immutable/chunks/scheduler.69ed1edc.js","_app/immutable/chunks/index.7977ad0e.js","_app/immutable/chunks/singletons.6482ebd5.js"];
export const stylesheets = ["_app/immutable/assets/1.f870a4f1.css"];
export const fonts = [];
