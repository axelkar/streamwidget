import { json, error } from '@sveltejs/kit';
import { GlobalThisState } from '$lib/serverState';
import { checkJwtReq } from '$lib/totpUtils';
import { _broadcastEvent } from './events/+server';

export function GET({ request }) {
	if (!checkJwtReq(request)) throw error(401, 'Unauthorized');

	const { currentSong, songs } = globalThis[GlobalThisState];
	return json({
		currentSong,
		songs
	});
}

export async function POST({ request }) {
	if (!checkJwtReq(request)) throw error(401, 'Unauthorized');

	const { currentSong } = await request.json();
	globalThis[GlobalThisState].currentSong = currentSong;
	_broadcastEvent({
		kind: 'updateCurrentSong',
		data: { currentSong }
	});
	return new Response('', { status: 200 });
}

