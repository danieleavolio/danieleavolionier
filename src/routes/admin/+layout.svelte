<script lang="ts">
	import { page } from '$app/state';
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();

	const tabs = [
		{ href: '/admin', label: 'Dashboard', exact: true },
		{ href: '/admin/posts', label: 'Posts', exact: false },
		{ href: '/admin/projects', label: 'Progetti', exact: false },
		{ href: '/admin/now', label: 'Now', exact: false },
		{ href: '/admin/appunti', label: 'Appunti', exact: false }
	];

	function isActive(tab: (typeof tabs)[number]): boolean {
		const path = page.url.pathname.replace(/\/$/, '') || '/';
		return tab.exact ? path === tab.href : path.startsWith(tab.href);
	}
</script>

<svelte:head><meta name="robots" content="noindex, nofollow" /></svelte:head>

{#if data.isAdmin}
	<div class="admin-layout">
		<header class="yr-panel admin-bar">
			<p class="brand"><span class="yr-panel__square"></span>YoRHa // ADMIN</p>
			<nav class="tabs-scroll" aria-label="Amministrazione">
				<ul class="yr-tabs">
					{#each tabs as tab (tab.href)}
						<li>
							<a
								href={tab.href}
								class:active={isActive(tab)}
								aria-current={isActive(tab) ? 'page' : undefined}>{tab.label}</a
							>
						</li>
					{/each}
				</ul>
			</nav>
			<div class="account">
				{#if data.user?.email}
					<span class="yr-badge yr-badge--muted email" title={data.user.email}
						>{data.user.email}</span
					>
				{/if}
				<a class="yr-button yr-button--ghost" href="/">Vai al sito</a>
				<form method="POST" action="/admin/login?/logout">
					<button type="submit" class="yr-button yr-button--danger">Esci</button>
				</form>
			</div>
		</header>
		<main class="main-content">{@render children?.()}</main>
	</div>
{:else}
	<main class="login-shell">{@render children?.()}</main>
{/if}

<style>
	.admin-layout {
		display: grid;
		gap: 1.25rem;
		width: 100%;
		min-width: 0;
		box-sizing: border-box;
	}

	.admin-bar {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.75rem 1.5rem;
		padding: 0.6rem 0.9rem;
	}

	.brand {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		margin: 0;
		font-family: var(--font-mono);
		font-weight: 700;
		font-size: 0.95rem;
		letter-spacing: 0.2rem;
		white-space: nowrap;
	}

	.tabs-scroll {
		flex: 1 1 18rem;
		min-width: 0;
		overflow-x: auto;
		scrollbar-width: thin;
	}

	.tabs-scroll :global(.yr-tabs) {
		flex-wrap: nowrap;
		width: max-content;
	}

	.account {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-inline-start: auto;
		min-width: 0;
	}

	.account form {
		margin: 0;
	}

	.email {
		max-width: 16rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		text-transform: none;
		letter-spacing: 0.03rem;
	}

	.account :global(.yr-button) {
		min-height: 2.1rem;
		padding-block: 0.25rem;
	}

	.main-content {
		min-width: 0;
		padding: 0;
	}

	.login-shell {
		max-width: 32rem;
		margin: 4rem auto;
	}

	@media (max-width: 720px) {
		.admin-bar {
			gap: 0.6rem;
		}

		.tabs-scroll {
			order: 3;
			flex-basis: 100%;
		}

		.account {
			margin-inline-start: auto;
		}

		.email {
			display: none;
		}
	}
</style>
