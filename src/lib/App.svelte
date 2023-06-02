<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fly, fade } from 'svelte/transition';
	import { EventSourcePolyfill } from 'event-source-polyfill';

	export let data: {
		songs: string[];
		currentSong: number;
	};
	export let isEmbedded: boolean;

	let songs: string[] = data.songs;
	let currentSong: number = data.currentSong;
	let changeSongError: string | null = null;

	let songTransitionChange = true;
	const songTransitionTime = 600;
	let songTransitionTimeout: number | null = null;
	let songTransitionText: string = songs[currentSong];

	function setCurrentSong(_: number) {
		currentSong = _;
		fetch('/api', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			},
			body: JSON.stringify({
				currentSong
			})
		}).catch((_) => {
			console.error(_), (changeSongError = _);
		});
	}

	let sse: EventSource | null = null;
	let sseError: string | null = null;
	onMount(() => {
		sse = new EventSourcePolyfill('/api/events', {
			headers: {
				'Authorization': localStorage.token
			}
		});
		sse.onerror = (event) => {
			sseError = event.toString();
		};
		sse.onmessage = (event) => {
			let msg = JSON.parse(event.data);
			console.log('new msg:', msg);
			if (typeof msg !== 'object' || msg === null || !msg.kind || !msg.data) return;
			switch (msg.kind) {
				case 'updateCurrentSong':
					currentSong = msg.data.currentSong;
					songTransitionChange = false;
					if (songTransitionTimeout !== null) clearInterval(songTransitionTimeout);
					songTransitionTimeout = setTimeout(() => {
						songTransitionChange = true;
						songTransitionTimeout = null;
						songTransitionText = songs[currentSong];
					}, songTransitionTime);
					break;
				case 'initialize':
					currentSong = msg.data.currentSong;
					songs = msg.data.songs;
					break;
			}
		};
	});
	onDestroy(() => {
		changeSongError = 'ondestroy';
		if (sse !== null) {
			sse.close();
			sse = null;
		}
		if (songTransitionTimeout !== null) clearInterval(songTransitionTimeout);
	});
</script>

{#if !isEmbedded}
	<div id="song-list">
		{#each songs as song, i}
			<div class:current={i == currentSong}>
				{song}
				<button on:click={() => setCurrentSong(i)}>Set current</button>
			</div>
		{/each}
	</div>

	<div>
		<button on:click={() => currentSong !== songs.length - 1 && setCurrentSong(currentSong + 1)}
			>Next</button
		>
		<button on:click={() => currentSong !== 0 && setCurrentSong(currentSong - 1)}>Previous</button>
		<a href="/embed">Embed link</a>
	</div>

	{#if changeSongError !== null}
		<div style="background-color: rgba(255, 255, 255, 0.5)">
			<h2>Error while changing current song:</h2>
			<pre>
			{changeSongError}
		</pre>
		</div>
	{/if}
	{#if sseError !== null}
		<div style="background-color: rgba(255, 255, 255, 0.5)">
			<h2>Error while connecting to the event stream:</h2>
			<pre>
			{sseError}
		</pre>
		</div>
	{/if}
{/if}

<!-- TODO: https://svelte.dev/tutorial/custom-css-transitions -->
<div class="notification-static">
	{#if songTransitionChange}
		<div class="notification-text" transition:fade={{ duration: songTransitionTime }}>
			{#if songTransitionText.trim().length !== 0}
				Current song: {songTransitionText}
			{/if}
		</div>
	{/if}
</div>

<style>
	:global(body) {
		margin: 0;
	}
	.current {
		color: lime;
	}
	#song-list {
		font-size: 3rem;

		padding: 1rem;
		margin: 0;
		background-color: rgba(255, 255, 255, 0.25);
		display: inline-block;

		/* Although it has the prefix, it works with all major browsers. */
		/*-webkit-text-stroke: 2px black;
		color: white;*/
	}
	.notification-static {
		height: 1.15em;
		font-size: 4rem;
		position: fixed;
		left: 0;
		bottom: 0;
		background-color: black;
		text-align: center;
		color: white;
		width: 100%;
		padding: 0.5rem;
	}
</style>
