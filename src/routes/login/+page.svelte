<script lang="ts">
	let totpValue = '';
	let totpSecretValue = '';
	import totpGen from 'totp-generator';

	const handleSubmit = async () => {
		// there should be some parsing before putting it in the url, but it's not the subject
		const res = await fetch('/api/login', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				totp: totpSecretValue ? totpGen(totpSecretValue) : totpValue,
			})
		});
		const { token } = await res.json();
		localStorage.token = token;
		location.href = '/';
	}
</script>

<form on:submit|preventDefault={handleSubmit}>
	<label for="totp">Time-based One Time Password</label><br/>
	<input id="totp" type="text" bind:value={totpValue} /><br/>
	OR optionally<br/>
	<label for="totpSecret">Input a TOTP secret</label><br/>
	<input id="totpSecret" type="text" bind:value={totpSecretValue} /><br/>
	<hr/>
	<button type="submit">log in</button>
</form>

