

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.f6caf213.js","_app/immutable/chunks/scheduler.e2ad6265.js","_app/immutable/chunks/index.7e17238a.js","_app/immutable/chunks/singletons.0f293520.js"];
export const stylesheets = ["_app/immutable/assets/1.f870a4f1.css"];
export const fonts = [];
