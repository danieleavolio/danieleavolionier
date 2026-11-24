<script lang="ts">
	import AdminContentManager from '#lib/components/AdminContentManager.svelte';

	let { data, form } = $props();
</script>

<AdminContentManager
	{data}
	{form}
	contentType="projects"
	labels={{
		title: 'Progetti',
		deleteTitle: 'Elimina Progetto',
		documentTitle: 'Projects admin | Daniele Avolio'
	}}
/>
