// Sposta nel bucket `notes` i PDF che le righe di `notes` servono ancora da /files/.
// Uso: node scripts/migrate-notes.mjs          (dry-run, non scrive nulla)
//      node scripts/migrate-notes.mjs --apply  (carica e aggiorna file_url/file_path)
import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { createClient } from '@supabase/supabase-js';

const apply = process.argv.includes('--apply');
const supabase = createClient(
	process.env.PUBLIC_SUPABASE_URL,
	process.env.SUPABASE_SERVICE_ROLE_KEY,
	{ auth: { persistSession: false } }
);

const { data: rows, error } = await supabase
	.from('notes')
	.select('id,title,file_url,file_path')
	.like('file_url', '/files/%');
if (error) throw error;

console.log(`${rows.length} appunti da migrare${apply ? '' : ' (dry-run)'}`);
for (const row of rows) {
	const name = decodeURIComponent(row.file_url.replace('/files/', ''));
	const path = `legacy-${name.replace(/[^a-zA-Z0-9.]+/g, '-').toLowerCase()}`;
	console.log(`- ${row.title}: static/files/${name} -> notes/${path}`);
	if (!apply) continue;

	const body = await readFile(new URL(`../static/files/${name}`, import.meta.url));
	const { error: uploadError } = await supabase.storage
		.from('notes')
		.upload(path, body, { contentType: 'application/pdf', upsert: true });
	if (uploadError) throw uploadError;
	const { data } = supabase.storage.from('notes').getPublicUrl(path);
	const { error: updateError } = await supabase
		.from('notes')
		.update({ file_url: data.publicUrl, file_path: path })
		.eq('id', row.id);
	if (updateError) throw updateError;
}
