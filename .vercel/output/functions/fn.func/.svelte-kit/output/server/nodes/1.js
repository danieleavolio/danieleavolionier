

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.eaeb8e15.js","_app/immutable/chunks/scheduler.40fa21c2.js","_app/immutable/chunks/index.babe5fbe.js","_app/immutable/chunks/singletons.b0b3bea0.js"];
export const stylesheets = ["_app/immutable/assets/1.f870a4f1.css"];
export const fonts = [];
