export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["android-chrome-192x192.png","android-chrome-512x512.png","apple-touch-icon.png","bachelor-thesis.pdf","CV-DA.pdf","favicon-16x16.png","favicon-32x32.png","favicon.ico","favicon.png","files/AlgorithmicGameTheory.pdf","files/bigdata_lab.pdf","files/bigdata_questions.pdf","files/DeepLearning.pdf","files/files.json","files/Handbook.pdf","files/MppGPU Theory.pdf","files/RETI-RIASSUNTO.pdf","files/tcs_questions.pdf","images/avatar.png","images/avatarold.png","images/dark1.png","images/nierui.png","images/pattern.png","robots.txt","site.webmanifest","sounds/core_77.ogg","sounds/core_81.ogg","sounds/wotw.mp3"]),
	mimeTypes: {".png":"image/png",".pdf":"application/pdf",".json":"application/json",".txt":"text/plain",".webmanifest":"application/manifest+json",".ogg":"audio/ogg",".mp3":"audio/mpeg"},
	_: {
		client: {"start":"_app/immutable/entry/start.c2ed031d.js","app":"_app/immutable/entry/app.7ffcec3b.js","imports":["_app/immutable/entry/start.c2ed031d.js","_app/immutable/chunks/scheduler.a5f99357.js","_app/immutable/chunks/singletons.35336ced.js","_app/immutable/chunks/parse.bee59afc.js","_app/immutable/chunks/control.c2cf8273.js","_app/immutable/entry/app.7ffcec3b.js","_app/immutable/chunks/preload-helper.a4192956.js","_app/immutable/chunks/scheduler.a5f99357.js","_app/immutable/chunks/index.0f8e246b.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			__memo(() => import('../output/server/nodes/0.js')),
			__memo(() => import('../output/server/nodes/1.js')),
			__memo(() => import('../output/server/nodes/2.js')),
			__memo(() => import('../output/server/nodes/5.js')),
			__memo(() => import('../output/server/nodes/6.js')),
			__memo(() => import('../output/server/nodes/7.js')),
			__memo(() => import('../output/server/nodes/8.js'))
		],
		routes: [
			{
				id: "/admin/editor",
				pattern: /^\/admin\/editor\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/admin/posts",
				pattern: /^\/admin\/posts\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/admin/projects",
				pattern: /^\/admin\/projects\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/admin/stack",
				pattern: /^\/admin\/stack\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 6 },
				endpoint: null
			},
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
