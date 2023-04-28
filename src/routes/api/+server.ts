import { json } from '@sveltejs/kit';
import serverState from '$lib/serverState';
import { _broadcastEvent } from './events/+server';

export function GET() {
	const { currentSong, songs } = serverState;
	return json({
		currentSong,
		songs
	});
}

export async function POST({ request }) {
	const { currentSong } = await request.json();
	serverState.currentSong = currentSong;
	_broadcastEvent({
		kind: 'updateCurrentSong',
		data: { currentSong }
	});
	return new Response('', { status: 200 });
}
