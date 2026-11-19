import { derived, writable, type Readable, type Writable } from 'svelte/store';
import { getContext, setContext } from 'svelte';

export type Locale = 'it' | 'en';

const dictionaries = {
	it: {
		nav_blog: 'BLOG',
		nav_projects: 'PROGETTI',
		nav_now: 'NOW',
		nav_data: 'DATA',
		nav_notes: 'APPUNTI',
		nav_home: 'Home',
		open_menu: 'Apri menu',
		close_menu: 'Chiudi menu',
		navigation_menu: 'Menu di navigazione',
		search_site: 'Cerca nel sito',
		search_hint_keyboard: 'Cerca (Ctrl+K)',
		search_placeholder: 'Cerca articoli, progetti, appunti (premi ↑↓ e Invio)...',
		search_hint: 'Digita per cercare tra tutti gli articoli, progetti e dispense universitarie.',
		search_no_results: 'Nessun risultato trovato per "{term}".',
		search_unavailable: 'Ricerca temporaneamente non disponibile.',
		search_retry: 'Riprova',
		search_loading: 'CARICAMENTO',
		search_move: 'Spostati',
		search_select: 'Seleziona',
		search_close: 'Chiudi',
		close: 'CHIUDI',
		filters: 'FILTRI',
		reset: 'RIPRISTINA',
		share: 'Condividi',
		share_x: 'Condividi su X',
		copy_link: 'Copia il link',
		copied: 'Link copiato.',
		copy_failed: 'Copia non riuscita. Puoi copiare il link dalla barra degli indirizzi.',
		author: 'Autore',
		read_also: 'Leggi anche',
		read_also_intro: 'Altre letture sullo stesso tema.',
		read_article: 'Leggi articolo',
		no_posts: 'Nessun post trovato!',
		no_projects: 'Nessun progetto trovato!',
		latest_posts: 'Ultimi articoli',
		latest_projects: 'Ultimi progetti',
		language: 'Lingua',
		language_it: 'Italiano',
		language_en: 'English',
		blog: 'Blog',
		projects: 'Progetti',
		data: 'Data',
		notes: 'Appunti',
		about_me: 'Chi sono',
		profile_intro:
			'Ciao, sono <b>Daniele Avolio</b>, <b><code>Data Engineer</code></b> presso <a href="https://agilelab.it/" target="_blank" rel="noopener"><i>Agile Lab</i></a> e laureato magistrale in <b>Informatica e Intelligenza Artificiale</b> presso l\'<a href="https://www.unical.it/" target="_blank" rel="noopener"><b>Università della Calabria</b></a>. Lavoro su pipeline dati scalabili ed ecosistemi Big Data, con forte specializzazione su <b><code>Apache Spark</code></b>, <b><code>Databricks</code></b>, <b><code>Google Cloud Platform (GCP)</code></b> e <b><code>Apache Airflow</code></b>. Ho inoltre solida esperienza nel <b>web development</b> (tra cui <a href="https://kit.svelte.dev/" target="_blank" rel="noopener"><b><code>SvelteKit</code></b></a> e <a href="https://angular.dev/" target="_blank" rel="noopener"><b><code>Angular</code></b></a>), e sono un grande appassionato di <b>videogiochi</b> e <b>cultura pop giapponese</b>.',
		rss: 'RSS'
	},
	en: {
		nav_blog: 'BLOG',
		nav_projects: 'PROJECTS',
		nav_now: 'NOW',
		nav_data: 'DATA',
		nav_notes: 'NOTES',
		nav_home: 'Home',
		open_menu: 'Open menu',
		close_menu: 'Close menu',
		navigation_menu: 'Navigation menu',
		search_site: 'Search the site',
		search_hint_keyboard: 'Search (Ctrl+K)',
		search_placeholder: 'Search articles, projects, notes (press ↑↓ and Enter)...',
		search_hint: 'Type to search all articles, projects and university notes.',
		search_no_results: 'No results found for "{term}".',
		search_unavailable: 'Search is temporarily unavailable.',
		search_retry: 'Try again',
		search_loading: 'LOADING',
		search_move: 'Move',
		search_select: 'Select',
		search_close: 'Close',
		close: 'CLOSE',
		filters: 'FILTERS',
		reset: 'RESET',
		share: 'Share',
		share_x: 'Share on X',
		copy_link: 'Copy link',
		copied: 'Link copied.',
		copy_failed: 'Copy failed. You can copy the link from the address bar.',
		author: 'Author',
		read_also: 'Read next',
		read_also_intro: 'More reads on the same topic.',
		read_article: 'Read article',
		no_posts: 'No posts found!',
		no_projects: 'No projects found!',
		latest_posts: 'Latest posts',
		latest_projects: 'Latest projects',
		language: 'Language',
		language_it: 'Italiano',
		language_en: 'English',
		blog: 'Blog',
		projects: 'Projects',
		data: 'Data',
		notes: 'Notes',
		about_me: 'About me',
		profile_intro:
			'Hi, I\'m <b>Daniele Avolio</b>, a <b><code>Data Engineer</code></b> at <a href="https://agilelab.it/" target="_blank" rel="noopener"><i>Agile Lab</i></a> with a master\'s degree in <b>Computer Science and Artificial Intelligence</b> from the <a href="https://www.unical.it/" target="_blank" rel="noopener"><b>University of Calabria</b></a>. I work on scalable data pipelines and Big Data ecosystems, specialising in <b><code>Apache Spark</code></b>, <b><code>Databricks</code></b>, <b><code>Google Cloud Platform (GCP)</code></b> and <b><code>Apache Airflow</code></b>. I also have solid experience in <b>web development</b> (including <a href="https://kit.svelte.dev/" target="_blank" rel="noopener"><b><code>SvelteKit</code></b></a> and <a href="https://angular.dev/" target="_blank" rel="noopener"><b><code>Angular</code></b></a>), and I\'m a big fan of <b>video games</b> and <b>Japanese pop culture</b>.',
		rss: 'RSS'
	}
} as const;

export type TranslationKey = keyof (typeof dictionaries)['it'];
export type Translator = (key: TranslationKey, params?: Record<string, string>) => string;

export interface I18n {
	locale: Writable<Locale>;
	t: Readable<Translator>;
	setLocale: (locale: Locale) => void;
}

const I18N_CONTEXT = Symbol('i18n');

export function detectLocale(acceptLanguage?: string | null): Locale {
	if (!acceptLanguage) return 'it';
	const first = acceptLanguage.split(',')[0].trim().toLowerCase();
	return first.startsWith('en') ? 'en' : 'it';
}

export function createI18n(initial: Locale): I18n {
	const locale = writable<Locale>(initial);
	const t = derived(locale, ($locale) => (key: TranslationKey, params?: Record<string, string>) => {
		let value: string = dictionaries[$locale][key] ?? dictionaries.it[key] ?? key;
		if (params) {
			for (const [param, replacement] of Object.entries(params)) {
				value = value.replaceAll(`{${param}}`, replacement);
			}
		}
		return value;
	});

	function setLocale(next: Locale) {
		locale.set(next);
		if (typeof document === 'undefined') return;
		const root = document.documentElement;
		root.lang = next;
		root.dataset.locale = next;
		try {
			localStorage.setItem('locale', next);
		} catch {
			// Private browsing can block storage.
		}
	}

	return { locale, t, setLocale };
}

export function provideI18n(i18n: I18n): I18n {
	return setContext(I18N_CONTEXT, i18n);
}

export function useI18n(): I18n {
	const context = getContext<I18n | undefined>(I18N_CONTEXT);
	return context ?? createI18n('it');
}
