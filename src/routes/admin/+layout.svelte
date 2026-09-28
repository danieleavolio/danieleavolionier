<script lang="ts">
	import { page } from '$app/stores';

	export let data;
</script>

{#if data.isAdmin}
	<div class="admin-layout">
		<aside class="sidebar">
			<div>
				<p class="brand">ADMIN</p>
				<nav aria-label="Amministrazione">
					<ul>
						<li>
							<a href="/admin/posts" class:active={$page.url.pathname.startsWith('/admin/posts')}
								>Posts</a
							>
						</li>
						<li>
							<a
								href="/admin/projects"
								class:active={$page.url.pathname.startsWith('/admin/projects')}>Projects</a
							>
						</li>
						<li>
							<a href="/admin/now" class:active={$page.url.pathname.startsWith('/admin/now')}>Now</a
							>
						</li>
					</ul>
				</nav>
			</div>
			<div class="account">
				<small title={data.user?.email}>{data.user?.email}</small>
				<form method="POST" action="/admin/login?/logout">
					<button type="submit">Esci</button>
				</form>
			</div>
		</aside>
		<main class="main-content"><slot /></main>
	</div>
{:else}
	<main class="login-shell"><slot /></main>
{/if}

<style>
	.admin-layout {
		display: flex;
		min-height: 75vh;
		width: 100%;
		box-sizing: border-box;
	}

	.sidebar {
		width: 220px;
		min-width: 220px;
		flex-shrink: 0;
		box-sizing: border-box;
		background-color: var(--automataBg);
		padding: 1.5rem 1rem;
		border-right: 1px solid var(--automataColor);
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.brand {
		font-family: var(--font-mono);
		letter-spacing: 0.2rem;
		font-weight: 700;
		margin: 0 0 1.5rem 0;
		font-size: 1.1rem;
		opacity: 0.9;
	}

	nav ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	nav li {
		list-style: none;
		padding: 0 !important;
		margin: 0 0 0.75rem 0 !important;
		background-image: none !important;
		max-inline-size: 100% !important;
	}

	nav a {
		display: block;
		width: 100%;
		box-sizing: border-box;
		text-decoration: none;
		text-align: center;
		text-transform: uppercase;
		font-family: var(--font-mono);
		font-weight: 500;
		font-size: 0.9rem;
		letter-spacing: 0.2rem;
		padding: 0.6rem 0.5rem;
		background-color: var(--automataBgRGBA);
		color: var(--automataColor);
		border: 1px solid var(--automataColor);
		border-radius: 0;
		box-shadow: none;
		transition: all 0.2s ease-in-out;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	nav a:hover,
	nav a.active {
		background-color: var(--automataColor);
		color: var(--automataBg) !important;
		text-shadow: none;
	}

	.account {
		margin-top: 3rem;
		display: grid;
		gap: 0.75rem;
		box-sizing: border-box;
	}

	.account small {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		opacity: 0.8;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		display: block;
	}

	.account button {
		width: 100%;
		box-sizing: border-box;
		padding: 0.55rem 1rem;
		font-family: var(--font-mono);
		font-size: 0.85rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.2rem;
		cursor: pointer;
		background-color: var(--automataBgRGBA);
		color: var(--automataColor);
		border: 1px solid var(--automataColor);
		border-radius: 0;
		box-shadow: none;
		transition: all 0.2s ease-in-out;
	}

	.account button:hover {
		background-color: var(--automataRed);
		color: var(--automataWhite);
		border-color: var(--automataRed);
	}

	.main-content {
		flex: 1;
		min-width: 0;
		padding: 1rem 1.5rem;
		box-sizing: border-box;
	}

	.login-shell {
		max-width: 32rem;
		margin: 4rem auto;
	}

	@media (max-width: 768px) {
		.admin-layout {
			flex-direction: column;
		}

		.sidebar {
			width: 100%;
			min-width: 100%;
			border-right: none;
			border-bottom: 1px solid var(--automataColor);
		}
	}
</style>
