export async function load({ fetch }) {
	const res = await fetch(`/api`);
	const item = await res.json();
	return {
		songs: item.songs,
		currentSong: item.currentSong
	};
}
