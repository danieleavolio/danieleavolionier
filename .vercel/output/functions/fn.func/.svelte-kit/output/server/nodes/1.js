

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.7a07a75d.js","_app/immutable/chunks/scheduler.dfb60aa9.js","_app/immutable/chunks/index.479912a9.js","_app/immutable/chunks/singletons.91a8b294.js"];
export const stylesheets = ["_app/immutable/assets/1.f870a4f1.css"];
export const fonts = [];
