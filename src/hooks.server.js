import { readFileSync, writeFileSync, existsSync } from "fs";
import { GlobalThisState } from "$lib/serverState"
import totp from "totp-generator";
import { encode } from "thirty-two";
import { randomBytes } from 'crypto';
import { hostname } from "os";

const isItmestarit = hostname() == "itmestarit";

const totpSecretPath = isItmestarit ? "/var/lib/streamwidget/totpsecret" : "./totpsecret";
let totpSecret = null;
if (existsSync(totpSecretPath)) {
	totpSecret = readFileSync(totpSecretPath, 'utf8');
} else {
	totpSecret = encode(randomBytes(20)).toString();
	writeFileSync(totpSecretPath, totpSecret);
}
console.log('TOTP secret:', totpSecret);

const jwtSecretPath = isItmestarit ? "/var/lib/streamwidget/jwtsecret" : "./jwtsecret";
let jwtSecret = null;
if (existsSync(jwtSecretPath)) {
	jwtSecret = readFileSync(jwtSecretPath, 'utf8');
} else {
	jwtSecret = randomBytes(20).toString('base64');
	writeFileSync(jwtSecretPath, jwtSecret);
}

globalThis[GlobalThisState] = {
	currentSong: 0,
	songs: [
		'',
		'Need You Now',
		'Come Together',
		'Lipstick Covered Magnet',
		'Stolen Dance',
		'Everlong',
		'Etude, op. 25 - no. 9 (G♭ major)',
		'Bohemian Like You',
		'This Is The Life',
		'Take On Me',
		'Karkulainen',
		'Lost On You',
		'Baggy Trousers'
	],
	totpSecret,
	jwtSecret,
};

