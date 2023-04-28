<script lang="ts">
	import App from '$lib/App.svelte';
	export let data;
</script>

<App {data} isEmbedded={false} />

<style>
	@media (prefers-color-scheme: dark) {
		:global(a) {
			color: aqua;
		}
		:global(body) {
			background-color: black;
			color: white;
		}
	}
</style>
