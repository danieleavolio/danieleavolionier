export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png","images/avatar.jpg","images/dark1.png","images/nierui.png"]),
	mimeTypes: {".png":"image/png",".jpg":"image/jpeg"},
	_: {
		client: {"start":"_app/immutable/entry/start.a5a30d68.js","app":"_app/immutable/entry/app.39926114.js","imports":["_app/immutable/entry/start.a5a30d68.js","_app/immutable/chunks/scheduler.57811b04.js","_app/immutable/chunks/singletons.a6faa154.js","_app/immutable/chunks/control.f5b05b5f.js","_app/immutable/entry/app.39926114.js","_app/immutable/chunks/preload-helper.a4192956.js","_app/immutable/chunks/scheduler.57811b04.js","_app/immutable/chunks/index.bffac608.js"],"stylesheets":[],"fonts":[]},
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
