export const GlobalThisState = Symbol.for('streamwidget.state');
import totpGen from 'totp-generator';
import jwt from 'jsonwebtoken';

export function totpNow(): string {
	return totpGen(globalThis[GlobalThisState].totpSecret);
}
export function checkTotp(totp: string): boolean {
	return totp == totpNow();
}
export function generateJwt(totp: string): string | null {
	if (!checkTotp(totp)) return null;
	return jwt.sign({ test: 1 }, globalThis[GlobalThisState].jwtSecret, { expiresIn: "12h" });
}
export function checkJwtReq(request): boolean {
	const token = request.headers.get("Authorization");
	console.log({ token })
	return typeof token === 'string' && checkJwt(token);
}
export function checkJwt(token: string): Record<string, unknown> | null {
	try {
		return jwt.verify(token, globalThis[GlobalThisState].jwtSecret);
	} catch(err) {
		console.log("jwt err");
		return null
	}
}

