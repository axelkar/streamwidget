import { GlobalThisState } from '$lib/serverState';
import { checkJwtReq } from '$lib/totpUtils';
import { error } from '@sveltejs/kit';

const eventClients: Set<{ connection: ReadableStreamDefaultController }> = new Set();
export function _broadcastEvent(event: { kind: string; data: unknown }) {
	const removeConnections = [];
	for (const { connection } of eventClients) {
		try {
			_sendEvent(connection, event);
			console.log("Sent a message");
		} catch (error) {
			if (error.code === 'ERR_INVALID_STATE') {
				removeConnections.push(connection);
			} else {
				console.error('Error while broadcasting:', error);
			}
		}
	}
	for (const connection of removeConnections) {
		eventClients.delete({ connection });
	}
}
export function _sendEvent(
	connection: ReadableStreamDefaultController,
	event: { kind: string; data: unknown }
) {
	connection.enqueue('data: ' + JSON.stringify(event) + '\n\n');
}
export function GET({ request }) {
	if (!checkJwtReq(request)) throw error(401, 'Unauthorized');

	let connection: ReadableStreamDefaultController | null = null;
	console.log("New connection");
	return new Response(
		new ReadableStream({
			start: (_) => {
				connection = _;
				eventClients.add({ connection });
				const { currentSong, songs } = globalThis[GlobalThisState];
				_sendEvent(connection, {
					kind: 'initialize',
					data: {
						currentSong,
						songs
					}
				});
			},
			cancel: () => {
				if (connection !== null) eventClients.delete({ connection });
			}
		}),
		{
			// These headers are important for the browser to detect a SSE request
			headers: {
				'Content-Type': 'text/event-stream',
				Connection: 'keep-alive',
				'Cache-Control': 'no-cache'
			}
		}
	);
}
