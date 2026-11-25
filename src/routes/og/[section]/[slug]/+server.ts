import { error } from '@sveltejs/kit';
import { getContentBySlug } from '#lib/server/public-content.ts';
import { renderOgPng, type OgCardInput } from '#lib/server/og-card.ts';

export const prerender = false;

const sitePages: Record<string, OgCardInput> = {
	home: {
		label: 'Home',
		title: 'Daniele Avolio',
		description: 'Data Engineer ad AgileLab. Articoli, progetti, appunti e CV.',
		footer: 'Spark · Databricks · GCP · Svelte'
	},
	blog: {
		label: 'Blog',
		title: 'Blog & articoli tecnici',
		description: 'Sviluppo web, intelligenza artificiale, dati e programmazione.',
		footer: 'pagine/'
	},
	progetti: {
		label: 'Progetti',
		title: 'Progetti & portfolio',
		description: 'Web app, esperimenti AI, videogiochi e software.',
		footer: 'progetti/'
	},
	appunti: {
		label: 'Appunti',
		title: 'Appunti universitari di Informatica',
		description: "Triennale e Magistrale all'Università della Calabria.",
		footer: 'appunti/'
	},
	cv: {
		label: 'CV',
		title: 'Curriculum di Daniele Avolio',
		description: 'Data Engineer: Spark, Databricks, Airflow, Azure, GCP, Python.',
		footer: 'cv/'
	},
	data: {
		label: 'Data',
		title: 'Dati di sistema',
		description: 'Competenze, stack ed esperienze lavorative.',
		footer: 'data/'
	},
	now: {
		label: 'Now',
		title: 'Cosa sto facendo adesso',
		description: 'Cosa studio, costruisco e leggo in questo periodo.',
		footer: 'now/'
	},
	'end-of-the-lova': {
		label: 'Minigame',
		title: 'End of the Lova',
		description: 'Salva i file di sistema nel minigioco di hacking in stile NieR.',
		footer: 'end-of-the-lova/'
	},
	privacy: {
		label: 'Privacy',
		title: 'Privacy Policy di Astra',
		description: 'Nessuna raccolta di dati personali. Tutto resta sul dispositivo.',
		footer: 'privacy-policy/'
	}
};

const labels: Record<string, string> = { pagine: 'Blog', progetti: 'Progetto' };

export async function GET({ params, locals }) {
	const section = params.section;
	const slug = params.slug.replace(/\.(png|svg)$/, '');

	if (!['pagine', 'progetti', 'site'].includes(section) || !/^[a-zA-Z0-9-]+$/.test(slug)) {
		throw error(404, 'Not found');
	}

	let card: OgCardInput;
	if (section === 'site') {
		if (!Object.hasOwn(sitePages, slug)) throw error(404, 'Not found');
		card = sitePages[slug];
	} else {
		const item = await getContentBySlug(
			locals.supabase,
			section === 'pagine' ? 'posts' : 'projects',
			slug,
			{ metadataOnly: true }
		);
		if (!item) throw error(404, 'Not found');
		const date = item.date ? new Date(item.date) : null;
		const when =
			date && !Number.isNaN(date.getTime())
				? date.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })
				: '';
		card = {
			label: labels[section],
			title: item.title || slug.replace(/-/g, ' '),
			description: item.description,
			footer: [(item.categories ?? []).slice(0, 2).join(' · '), when].filter(Boolean).join('  //  ')
		};
	}

	const png = await renderOgPng(card);
	return new Response(new Uint8Array(png), {
		headers: {
			'Content-Type': 'image/png',
			'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800'
		}
	});
}
