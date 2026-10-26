-- Post images storage: drag-and-drop images from the admin editor are uploaded
-- here by the server (service role, which bypasses these policies) and served
-- publicly from /object/public/post-images/.
insert into storage.buckets (id, name, public, created_at, updated_at)
values ('post-images', 'post-images', true, now(), now())
on conflict (id) do update set public = true;

-- Public read so the images are reachable without an auth session.
drop policy if exists "Public can read post images" on storage.objects;
create policy "Public can read post images" on storage.objects
for select to anon, authenticated
using (bucket_id = 'post-images');

-- Only admins can manage the bucket directly with their Supabase session.
drop policy if exists "Admins manage post images" on storage.objects;
create policy "Admins manage post images" on storage.objects
for all to authenticated
using (bucket_id = 'post-images' and (select private.is_admin()))
with check (bucket_id = 'post-images' and (select private.is_admin()));
