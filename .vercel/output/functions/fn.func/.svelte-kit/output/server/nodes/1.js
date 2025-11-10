

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.074600c3.js","_app/immutable/chunks/scheduler.a5f99357.js","_app/immutable/chunks/index.0f8e246b.js","_app/immutable/chunks/stores.04df52bf.js","_app/immutable/chunks/singletons.35336ced.js"];
export const stylesheets = ["_app/immutable/assets/1.f870a4f1.css"];
export const fonts = [];
