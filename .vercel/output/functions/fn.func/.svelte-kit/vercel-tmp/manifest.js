export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["bachelor-thesis.pdf","CV-DA.pdf","favicon.png","images/avatar.jpg","images/dark1.png","images/nierui.png","robots.txt"]),
	mimeTypes: {".pdf":"application/pdf",".png":"image/png",".jpg":"image/jpeg",".txt":"text/plain"},
	_: {
		client: {"start":"_app/immutable/entry/start.c2103376.js","app":"_app/immutable/entry/app.bbdfa788.js","imports":["_app/immutable/entry/start.c2103376.js","_app/immutable/chunks/scheduler.dfb60aa9.js","_app/immutable/chunks/singletons.8b282d5d.js","_app/immutable/chunks/index.3e836afe.js","_app/immutable/chunks/control.f5b05b5f.js","_app/immutable/entry/app.bbdfa788.js","_app/immutable/chunks/preload-helper.a4192956.js","_app/immutable/chunks/scheduler.dfb60aa9.js","_app/immutable/chunks/index.479912a9.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			__memo(() => import('../output/server/nodes/0.js')),
			__memo(() => import('../output/server/nodes/1.js'))
		],
		routes: [
			
		],
		matchers: async () => {
			
			return {  };
		}
	}
}
})();
