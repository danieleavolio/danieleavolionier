<div class="admin-layout">
	<aside class="sidebar">
		<nav>
			<ul>
				<li><a href="/admin/posts">Posts</a></li>
				<li><a href="/admin/projects">Projects</a></li>
				<li><a href="/admin/stack">Stack</a></li>
			</ul>
		</nav>
	</aside>
	<main class="main-content">
		<slot />
	</main>
</div>

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

	.main-content {
		flex: 1;
		padding: 1rem;
	}
</style>
