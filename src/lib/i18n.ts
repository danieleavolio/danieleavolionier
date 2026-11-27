/** Lingue del sito: l'italiano è la fonte, l'inglese è tradotto alla pubblicazione. */
export type Lang = 'it' | 'en';

export const translatedLangs = ['en'] as const;

export const langFromPath = (pathname: string): Lang =>
	pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'it';

/** Testi fissi dell'interfaccia. Il contenuto degli articoli non sta qui. */
const dictionary = {
	it: {
		htmlLang: 'it',
		locale: 'it-IT',
		menu: { blog: 'BLOG', projects: 'PROGETTI', now: 'NOW', data: 'DATA', notes: 'APPUNTI' },
		blogPath: '/pagine',
		dateLabel: 'Data',
		readingTime: 'min di lettura',
		toc: 'Indice',
		tocLabel: 'Indice dell’articolo',
		related: 'Leggi anche',
		relatedIntro: 'Altre letture sullo stesso tema.',
		readArticle: 'Leggi articolo',
		share: 'Condividi',
		shareLabel: 'Condividi questo contenuto',
		shareOnX: 'Condividi su X',
		copyLink: 'Copia il link',
		copied: 'Link copiato.',
		copyFailed: 'Copia non riuscita. Puoi copiare il link dalla barra degli indirizzi.',
		author: 'Autore',
		authorLabel: "Informazioni sull'autore",
		backToTop: 'Torna su',
		readingWidth: 'Larghezza di lettura',
		authorBio:
			'Sviluppatore e amante del mondo dei videogiochi 🎮 e della cultura pop giapponese 🗾',
		systemOnline: 'Sistema online',
		switchTo: 'Read in English',
		switchShort: 'EN',
		blogTitle: 'Blog',
		blogIntro: 'Articoli, recensioni e appunti di lavoro.',
		notTranslated: 'Questo articolo non è ancora disponibile in inglese.'
	},
	en: {
		htmlLang: 'en',
		locale: 'en-GB',
		menu: { blog: 'BLOG', projects: 'PROJECTS', now: 'NOW', data: 'DATA', notes: 'NOTES' },
		blogPath: '/en/pagine',
		dateLabel: 'Date',
		readingTime: 'min read',
		toc: 'Contents',
		tocLabel: 'Article contents',
		related: 'Read next',
		relatedIntro: 'More reading on the same topic.',
		readArticle: 'Read article',
		share: 'Share',
		shareLabel: 'Share this content',
		shareOnX: 'Share on X',
		copyLink: 'Copy the link',
		copied: 'Link copied.',
		copyFailed: 'Copy failed. You can copy the link from the address bar.',
		author: 'Author',
		authorLabel: 'About the author',
		backToTop: 'Back to top',
		readingWidth: 'Reading width',
		authorBio: 'Developer, video game lover 🎮 and fan of Japanese pop culture 🗾',
		systemOnline: 'System online',
		switchTo: 'Leggi in italiano',
		switchShort: 'IT',
		blogTitle: 'Blog',
		blogIntro: 'Articles, reviews and working notes, translated from Italian.',
		notTranslated: 'This article is not available in English yet.'
	}
} as const;

export const ui = (lang: Lang) => dictionary[lang];

export const articlePath = (slug: string, lang: Lang) =>
	`${lang === 'en' ? '/en' : ''}/pagine/${encodeURIComponent(slug)}`;
