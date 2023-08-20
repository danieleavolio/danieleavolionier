<script lang="ts">
	import { Square } from "lucide-svelte";

	
</script>

<div class="page-data">
	<div class="top-header">
		<Square />
		<p>Daniele Avolio: Master-student</p>
	</div>
	<div class="outer-box">
		<div class="inner-box">
			<img
			src="images/avatar.jpg"
				alt=""
			/>
			<div class="main-features">
				<p>
					<b>Daniele Avolio</b> is a master-student in <b>Computer Science and Artificial Intelligence</b> at the University of Calabria. He developed 
					a strong interest in the field of Artificial Intelligence and Machine Learning. He have experience in <b>Front-end development 
					</b>using the <b>SvelteKit and Angular</b> frameworks.
				</p>
				<div class="socials">
					<a target="_blank" class="title" href="https://www.linkedin.com/in/danieleavolio/">Linkedin</a>
					<a target="_blank" href="https://twitter.com/avolio_daniele">Twitter</a>
					<a target="_blank" href="https://github.com/danieleavolio">GitHub</a>
					<a href="mailto:daniele.avolio14@gmail.com">EMAIL</a>
				</div>
				<a target="_blank" href="CV-DA.pdf">CV</a>
			</div>
		</div>
	</div>
</div>

<style>
	a {
		z-index: 20;
	}
	.top-header {
		padding: 0.1em;
		display: flex;
		align-items: center;
		font-size: var(--font-size-fluid-2);
	}
	.page-data {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: var(--automataBgOpacity);
	}

	.top-header {
		background-color: var(--automataBgRGBA);
		width: 100%;
	}
	.outer-box {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	img {
		max-width: var(--size-14);

		max-height: 100%;
		object-fit: cover;
		aspect-ratio: 1/1;
		box-shadow: none;
	}

	.inner-box {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 2em;
		align-items: center;
		height: 100%;
		padding: 0.5rem;
		margin: 0.2em;
		border-top: 1px solid var(--automataBgRGBA);
		border-bottom: 1px solid var(--automataBgRGBA);
	}

	.main-features {
		display: flex;
		flex-direction: column;
		gap: 2em;
	}

	.socials {
		display: flex;
		flex-wrap: wrap;
		flex-direction: row;
		justify-content: center;
		gap: 1em;
		margin-bottom: 1em;
	}

	@media (min-width: 1000px) {
		.inner-box {
			flex-direction: row;
			justify-content: center;
			gap: 2em;
			align-items: center;
			height: 100%;
			padding: 0.5rem;
			margin: 0.4em;
			border-top: 1px solid var(--automataBgRGBA);
			border-bottom: 1px solid var(--automataBgRGBA);
		}
		img {
			width: var(--size-14);
			height: 100%;
			object-fit: cover;
			aspect-ratio: 1/1;
		}

		.socials {
			justify-content: start;
			margin-bottom: 0;
		}
	}
</style>
