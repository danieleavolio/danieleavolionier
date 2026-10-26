import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
	process.env.PUBLIC_SUPABASE_URL,
	process.env.SUPABASE_SERVICE_ROLE_KEY,
	{ auth: { persistSession: false } }
);

const name = 'post-images';
const { error } = await supabase.storage.createBucket(name, {
	public: true,
	fileSizeLimit: 4 * 1024 * 1024,
	allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
});
if (error) {
	const list = await supabase.storage.listBuckets();
	console.log('createBucket failed:', error.message);
	console.log('buckets now:', (list.data ?? []).map((bucket) => bucket.id).join(', '));
	process.exit(0);
}
console.log('bucket created:', name);
