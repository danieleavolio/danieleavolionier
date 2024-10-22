export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["android-chrome-192x192.png","android-chrome-512x512.png","apple-touch-icon.png","bachelor-thesis.pdf","CV-DA.pdf","favicon-16x16.png","favicon-32x32.png","favicon.ico","favicon.png","files/AlgorithmicGameTheory.pdf","files/bigdata_lab.pdf","files/bigdata_questions.pdf","files/DeepLearning.pdf","files/Handbook.pdf","files/MppGPU Theory.pdf","files/RETI-RIASSUNTO.pdf","files/tcs_questions.pdf","images/avatar.png","images/avatarold.png","images/dark1.png","images/nierui.png","images/pattern.png","robots.txt","site.webmanifest","sounds/core_77.ogg","sounds/core_81.ogg","sounds/wotw.mp3"]),
	mimeTypes: {".png":"image/png",".pdf":"application/pdf",".txt":"text/plain",".webmanifest":"application/manifest+json",".ogg":"audio/ogg",".mp3":"audio/mpeg"},
	_: {
		client: {"start":"_app/immutable/entry/start.bfab37a3.js","app":"_app/immutable/entry/app.25cbbcfc.js","imports":["_app/immutable/entry/start.bfab37a3.js","_app/immutable/chunks/scheduler.38e9bcec.js","_app/immutable/chunks/singletons.79a72569.js","_app/immutable/chunks/control.c2cf8273.js","_app/immutable/entry/app.25cbbcfc.js","_app/immutable/chunks/preload-helper.a4192956.js","_app/immutable/chunks/scheduler.38e9bcec.js","_app/immutable/chunks/index.fa6e9378.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			__memo(() => import('../output/server/nodes/0.js')),
			__memo(() => import('../output/server/nodes/1.js'))
		],
		routes: [
			{
				id: "/api/files",
				pattern: /^\/api\/files\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/files/_server.ts.js'))
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
}
})();
