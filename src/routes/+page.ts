import { redirect } from '@sveltejs/kit';
export async function load({ fetch }) {
	if (localStorage.token == null) throw redirect(302, "/login");
	const res = await fetch(`/api`, {
		headers: {
			'Authorization': localStorage.token
		}
	});
	const item = await res.json();
	return {
		songs: item.songs,
		currentSong: item.currentSong
	};
}
