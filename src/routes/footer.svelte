<script lang="ts">
	import * as config from '#lib/config.ts';
	import { useI18n } from '#lib/i18n.ts';

	const { t } = useI18n();
</script>

<footer>
	<p>
		{config.title} &copy {new Date().getFullYear()} ·
		<a href="/rss.xml" class="rss-link">{$t('rss')}</a>
	</p>
</footer>

<style>
	footer {
		padding-block: var(--size-7);
		border-top: 1px solid var(--border);
	}

	p {
		color: var(--text-2);
	}

	.rss-link {
		color: var(--text-2);
		text-decoration: none;
		transition: color 0.2s ease;
	}

	.rss-link:hover {
		color: var(--text-1);
		text-decoration: underline;
	}
</style>
