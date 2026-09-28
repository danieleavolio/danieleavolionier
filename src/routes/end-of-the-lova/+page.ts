import type { PageLoad } from './$types';
import allFiles from '../../../static/files/files.json';

export const load = (async () => {
	return {
		files: allFiles
	};
}) satisfies PageLoad;
