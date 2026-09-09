<script lang="ts">
	export let data;
</script>

{#if data.isAdmin}
	<div class="admin-layout">
		<aside class="sidebar">
			<p class="brand">ADMIN</p>
			<nav aria-label="Amministrazione">
				<ul>
					<li><a href="/admin/posts">Posts</a></li>
					<li><a href="/admin/projects">Projects</a></li>
					<li><a href="/admin/now">Now</a></li>
				</ul>
			</nav>
			<div class="account">
				<small>{data.user?.email}</small>
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
	}

	.sidebar {
		width: 200px;
		background-color: var(--automataBg);
		padding: 1rem;
		border-right: 1px solid var(--automataColor);
	}

	.brand {
		font-family: var(--font-mono);
		letter-spacing: 0.15rem;
	}

	nav ul {
		list-style: none;
		padding: 0;
	}

	nav li {
		margin-bottom: 1rem;
	}

	nav a {
		text-decoration: none;
		color: var(--automataColor);
	}

	.account {
		margin-top: 3rem;
		display: grid;
		gap: 0.75rem;
		word-break: break-word;
	}

	.account button {
		width: 100%;
	}

	.main-content {
		flex: 1;
		padding: 1rem;
	}

	.login-shell {
		max-width: 32rem;
		margin: 4rem auto;
	}
</style>
