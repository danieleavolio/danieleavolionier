// Build the real production client/SSR bundles without deployment packaging.
// adapter-vercel needs symlink privileges on Windows; Vercel's Linux build does not.
process.env.BUILD_PREVIEW = 'true';
const { build } = await import('vite');
await build();
