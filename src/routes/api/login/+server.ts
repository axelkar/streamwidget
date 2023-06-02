import { json, error } from '@sveltejs/kit';
import { generateJwt } from '$lib/totpUtils';

export async function POST({ request }) {
	const { totp } = await request.json();
	if (typeof totp !== 'string') throw error(400, 'Bad Request');
	const token = generateJwt(totp);
	if (token == null) throw error(401, 'Unauthorized');

	return json({
		token
	});
}

