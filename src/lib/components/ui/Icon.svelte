<script lang="ts">
	type IconName =
		| 'home'
		| 'menu'
		| 'close'
		| 'search'
		| 'chevron-down'
		| 'arrow-right'
		| 'copy'
		| 'external'
		| 'empty'
		| 'theme';

	let {
		name,
		size = 24,
		strokeWidth = 1.6
	}: { name: IconName; size?: number; strokeWidth?: number } = $props();
</script>

<svg
	class="icon"
	xmlns="http://www.w3.org/2000/svg"
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width={strokeWidth}
	stroke-linecap="square"
	stroke-linejoin="miter"
	aria-hidden="true"
	focusable="false"
>
	{#if name === 'home'}
		<rect x="3.5" y="3.5" width="7" height="7" />
		<rect x="13.5" y="3.5" width="7" height="7" />
		<rect x="3.5" y="13.5" width="7" height="7" />
		<rect class="solid" x="13.5" y="13.5" width="7" height="7" />
	{:else if name === 'menu'}
		<g class="solid">
			<rect x="4" y="4" width="2.6" height="2.6" />
			<rect x="10.7" y="4" width="2.6" height="2.6" />
			<rect x="17.4" y="4" width="2.6" height="2.6" />
			<rect x="4" y="10.7" width="2.6" height="2.6" />
			<rect x="10.7" y="10.7" width="2.6" height="2.6" />
			<rect x="17.4" y="10.7" width="2.6" height="2.6" />
			<rect x="4" y="17.4" width="2.6" height="2.6" />
			<rect x="10.7" y="17.4" width="2.6" height="2.6" />
			<rect x="17.4" y="17.4" width="2.6" height="2.6" />
		</g>
	{:else if name === 'close'}
		<path d="M5 5l14 14M19 5L5 19" />
	{:else if name === 'search'}
		<rect x="3.5" y="3.5" width="12" height="12" />
		<path d="M15.5 15.5l5 5" />
		<rect class="solid" x="7.5" y="7.5" width="4" height="4" />
	{:else if name === 'chevron-down'}
		<path d="M5 8.5l7 7 7-7" />
		<rect class="solid" x="11" y="14.6" width="2" height="2" />
	{:else if name === 'arrow-right'}
		<path d="M4 12h15M13 6l6 6-6 6" />
	{:else if name === 'copy'}
		<rect x="8.5" y="8.5" width="11" height="11" />
		<path d="M16 8.5V4H4v12h4.5" />
	{:else if name === 'external'}
		<path d="M13.5 4H20v6.5M20 4l-8.5 8.5" />
		<path d="M18.5 13.5V20H4V5.5h6.5" />
	{:else if name === 'empty'}
		<rect x="4" y="4" width="16" height="16" />
		<path d="M8.5 15.5l7-7" />
		<rect class="solid" x="10.5" y="10.5" width="3" height="3" />
	{:else if name === 'theme'}
		<rect x="4" y="4" width="16" height="16" />
		<path class="solid" d="M12 4h8v16h-8z" />
	{/if}
</svg>

<style>
	.icon {
		display: block;
		flex: 0 0 auto;
		fill: none;
		stroke: currentColor;
	}
	.solid {
		fill: currentColor;
		stroke: none;
	}
</style>
