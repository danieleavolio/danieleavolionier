// Traduce in inglese gli articoli pubblicati (DeepL) e salva il risultato in `translations`.
// Uso: npm run translate                      (dry-run: dice cosa tradurrebbe, non scrive nulla)
//      npm run translate -- --apply           (traduce e salva gli articoli nuovi o cambiati)
//      npm run translate -- --apply --slug=x  (un solo articolo)
//      npm run translate -- --apply --force   (ritraduce anche quelli già aggiornati)
// Serve DEEPL_API_KEY e SUPABASE_SERVICE_ROLE_KEY in .env. Il salvataggio dall'admin
// traduce già da solo: questo script serve per gli articoli che esistevano prima.
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { createServer } from 'vite';

const args = process.argv.slice(2);
const apply = args.includes('--apply');
const force = args.includes('--force');
const only = args.find((arg) => arg.startsWith('--slug='))?.slice(7);
const apiKey = process.env.DEEPL_API_KEY?.trim();

if (apply && !apiKey) {
	console.error('Manca DEEPL_API_KEY in .env.');
	process.exit(1);
}
const supabase = createClient(
	process.env.PUBLIC_SUPABASE_URL,
	process.env.SUPABASE_SERVICE_ROLE_KEY,
	{ auth: { persistSession: false } }
);

const server = await createServer({
	server: { middlewareMode: true },
	appType: 'custom',
	logLevel: 'error'
});
try {
	const { syncTranslation, sourceHash } = await server.ssrLoadModule(
		'/src/lib/server/translations.ts'
	);
	const { restoreArticleHtml } = await server.ssrLoadModule('/src/lib/server/article-repairs.ts');

	let query = supabase
		.from('posts')
		.select('slug,title,description,content_html,metadata,published')
		.eq('published', true)
		.order('date', { ascending: false });
	if (only) query = query.eq('slug', only);
	const { data: posts, error } = await query;
	if (error) throw error;
	const { data: stored, error: storedError } = await supabase
		.from('translations')
		.select('slug,source_hash')
		.eq('lang', 'en');
	if (storedError) {
		throw new Error(
			`Tabella translations non raggiungibile (${storedError.message}). Hai applicato supabase/migrations/20261128_translations.sql?`
		);
	}
	const hashes = new Map(stored.map((row) => [row.slug, row.source_hash]));

	console.log(`${posts.length} articoli pubblicati${apply ? '' : ' (dry-run)'}`);
	let characters = 0;
	const counts = { updated: 0, unchanged: 0, failed: 0, skipped: 0 };
	for (const row of posts) {
		const post = {
			slug: row.slug,
			title: row.title ?? row.slug,
			description: row.description ?? '',
			contentHtml: restoreArticleHtml(row.content_html, row.metadata ?? {}),
			published: true
		};
		const current = hashes.get(post.slug) === sourceHash(post);
		const size = post.title.length + post.description.length + post.contentHtml.length;
		const state = current && !force ? 'aggiornato' : hashes.has(post.slug) ? 'da rifare' : 'nuovo';
		console.log(`- ${post.slug}: ${state} (${size} caratteri HTML)`);
		if (state !== 'aggiornato') characters += size;
		if (!apply) continue;
		const result = await syncTranslation(supabase, post, { apiKey, force });
		counts[result]++;
		if (result === 'failed') console.log('  traduzione non riuscita, vedi sopra');
	}
	if (!apply) {
		console.log(`Da tradurre: circa ${characters} caratteri (l'HTML conta più del testo).`);
		console.log('Per tradurre davvero: npm run translate -- --apply');
	} else {
		console.log(counts);
	}

	if (apiKey) {
		const host = apiKey.endsWith(':fx') ? 'api-free.deepl.com' : 'api.deepl.com';
		const usage = await fetch(`https://${host}/v2/usage`, {
			headers: { Authorization: `DeepL-Auth-Key ${apiKey}` }
		});
		if (usage.ok) {
			const { character_count: used, character_limit: limit } = await usage.json();
			console.log(`DeepL: ${used} / ${limit} caratteri usati questo mese.`);
		}
	}
} finally {
	await server.close();
}
