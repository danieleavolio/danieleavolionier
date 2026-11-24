<script lang="ts">
	import AdminContentManager from '#lib/components/AdminContentManager.svelte';

	let { data, form } = $props();
</script>

<AdminContentManager
	{data}
	{form}
	contentType="posts"
	labels={{
		title: 'Posts',
		deleteTitle: 'Elimina Post',
		documentTitle: 'Posts admin | Daniele Avolio'
	}}
/>
