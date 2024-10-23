

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.de9d569f.js","_app/immutable/chunks/scheduler.38e9bcec.js","_app/immutable/chunks/index.fa6e9378.js","_app/immutable/chunks/stores.543abce5.js","_app/immutable/chunks/singletons.4b30d006.js"];
export const stylesheets = ["_app/immutable/assets/1.f870a4f1.css"];
export const fonts = [];
