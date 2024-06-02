export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["android-chrome-192x192.png","android-chrome-512x512.png","apple-touch-icon.png","bachelor-thesis.pdf","CV-DA.pdf","favicon-16x16.png","favicon-32x32.png","favicon.ico","favicon.png","files/q&a.pdf","images/avatar.jpg","images/avatar.png","images/dark1.png","images/nierui.png","images/pattern.png","robots.txt","site.webmanifest"]),
	mimeTypes: {".png":"image/png",".pdf":"application/pdf",".ico":"image/vnd.microsoft.icon",".jpg":"image/jpeg",".txt":"text/plain",".webmanifest":"application/manifest+json"},
	_: {
		client: {"start":"_app/immutable/entry/start.9af69918.js","app":"_app/immutable/entry/app.77a99823.js","imports":["_app/immutable/entry/start.9af69918.js","_app/immutable/chunks/scheduler.40fa21c2.js","_app/immutable/chunks/singletons.3166469a.js","_app/immutable/chunks/control.f5b05b5f.js","_app/immutable/entry/app.77a99823.js","_app/immutable/chunks/preload-helper.a4192956.js","_app/immutable/chunks/scheduler.40fa21c2.js","_app/immutable/chunks/index.babe5fbe.js"],"stylesheets":[],"fonts":[]},
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
