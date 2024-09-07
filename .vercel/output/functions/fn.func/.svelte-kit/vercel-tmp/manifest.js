export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["android-chrome-192x192.png","android-chrome-512x512.png","apple-touch-icon.png","bachelor-thesis.pdf","CV-DA.pdf","favicon-16x16.png","favicon-32x32.png","favicon.ico","favicon.png","files/AlgorithmicGameTheory.pdf","files/bigdata_lab.pdf","files/bigdata_questions.pdf","files/DeepLearning.pdf","files/RETI-RIASSUNTO.pdf","files/tcs_questions.pdf","images/avatar.jpg","images/avatar.png","images/dark1.png","images/nierui.png","images/pattern.png","robots.txt","site.webmanifest"]),
	mimeTypes: {".png":"image/png",".pdf":"application/pdf",".jpg":"image/jpeg",".txt":"text/plain",".webmanifest":"application/manifest+json"},
	_: {
		client: {"start":"_app/immutable/entry/start.dbf56528.js","app":"_app/immutable/entry/app.25aa425e.js","imports":["_app/immutable/entry/start.dbf56528.js","_app/immutable/chunks/scheduler.69ed1edc.js","_app/immutable/chunks/singletons.fd3b6e73.js","_app/immutable/chunks/control.c2cf8273.js","_app/immutable/entry/app.25aa425e.js","_app/immutable/chunks/preload-helper.a4192956.js","_app/immutable/chunks/scheduler.69ed1edc.js","_app/immutable/chunks/index.7977ad0e.js"],"stylesheets":[],"fonts":[]},
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
