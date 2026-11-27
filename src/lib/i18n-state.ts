import { page } from '$app/state';
import { langFromPath, ui } from '#lib/i18n.ts';

/**
 * Lingua e testi fissi della pagina corrente. Sono getter: letti nel template di un
 * componente (anche con la sintassi legacy) si aggiornano quando cambia l'URL.
 */
export const i18n = {
	get lang() {
		return langFromPath(page.url.pathname);
	},
	get t() {
		return ui(this.lang);
	},
	/** Percorso della stessa pagina nell'altra lingua, se la pagina lo dichiara. */
	get other() {
		const alternates = (page.data as { alternates?: { it?: string | null; en?: string | null } })
			.alternates;
		return (this.lang === 'en' ? alternates?.it : alternates?.en) ?? null;
	}
};
