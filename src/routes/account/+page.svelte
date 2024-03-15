<!-- src/routes/account/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import Avatar from './Avatar.svelte';

	export let data;
	export let form;

	let { session, supabase, profile } = data;
	$: ({ session, supabase, profile } = data);

	let profileForm: HTMLFormElement;
	let loading = false;
	let fullName: string = profile?.full_name ?? '';
	let username: string = profile?.username ?? '';
	let website: string = profile?.website ?? '';
	let avatarUrl: string = profile?.avatar_url ?? '';

	const handleSubmit: SubmitFunction = () => {
		loading = true;
		return async () => {
			loading = false;
		};
	};

	const handleSignOut: SubmitFunction = () => {
		loading = true;
		return async ({ update }) => {
			loading = false;
			update();
		};
	};
</script>

<div class="form-widget space-y-5">
	<form
		class="form-widget card p-4 flex flex-col items-center gap-4"
		method="post"
		action="?/update"
		use:enhance={handleSubmit}
		bind:this={profileForm}
	>
		<Avatar
			{supabase}
			bind:url={avatarUrl}
			size={10}
			on:upload={() => {
				profileForm.requestSubmit();
			}}
		/>
		<div>
			<input
				id="email"
				class="input"
				title="Input (text)"
				type="text"
				value={session.user.email}
				disabled
			/>
		</div>

		<div>
			<input
				id="fullName"
				class="input"
				title="Input (text)"
				name="fullName"
				type="text"
				value={form?.fullName ?? fullName}
				placeholder="Full Name"
			/>
		</div>

		<div>
			<input
				id="username"
				class="input"
				title="Input (text)"
				name="username"
				type="text"
				value={form?.username ?? username}
				placeholder="Username"
			/>
		</div>

		<div>
			<input
				id="website"
				class="input"
				title="Input (url)"
				name="website"
				type="url"
				value={form?.website ?? website}
				placeholder="example.com"
			/>
		</div>

		<div>
			<input
				type="submit"
				class="button block btn variant-filled"
				value={loading ? 'Loading...' : 'Update'}
				disabled={loading}
			/>
		</div>
	</form>

	<form method="post" action="?/signout" use:enhance={handleSignOut}>
		<div class="flex justify-center">
			<button class="button block btn variant-filled" disabled={loading}>Sign Out</button>
		</div>
	</form>
</div>
