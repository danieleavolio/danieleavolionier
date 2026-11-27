import { redirect } from '@sveltejs/kit';

// Solo gli articoli hanno una versione inglese: /en porta all'elenco.
export const load = () => {
	throw redirect(302, '/en/pagine');
};
