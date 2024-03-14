<script lang="ts">
	import { TabGroup, Tab } from '@skeletonlabs/skeleton';
	import { signInWithEmail, signUpWithEmail, signOut } from '$lib/auth';
	import { writable } from 'svelte/store';

	let tabSet: number = 0;
	let isLoggedIn = writable(false);
	let username: string = '';
	let password: string = '';
	let errorMessage: string = '';

	async function handleLogin(): Promise<void> {
		try {
			const response = await signInWithEmail(username, password);
			const { success, error } = response;
			if (!success) {
				throw error || new Error('An unknown error occurred');
			}
			console.log('User logged in successfully');
			isLoggedIn.set(true);
			username = '';
			password = '';
			errorMessage = '';
		} catch (error) {
			console.error('Error logging in:', (error as Error).message);
			errorMessage = (error as Error).message || 'An unknown error occurred';
		}
	}

	async function handleSignUp(): Promise<void> {
		try {
			// Use the signUpWithEmail function to sign up the user
			const response = await signUpWithEmail(username, password);
			const { success, error } = response;
			if (!success) {
				throw error || new Error('An unknown error occurred');
			}
			console.log('User signed up successfully');
			// Automatically log in the user after signing up
			await handleLogin();
		} catch (error) {
			console.error('Error signing up:', (error as Error).message);
			errorMessage = (error as Error).message || 'An unknown error occurred';
		}
	}

	async function handleLogout(): Promise<void> {
		try {
			await signOut();
			isLoggedIn.set(false);
			console.log('User signed out successfully');
		} catch (error) {
			console.error('Error signing out:', (error as Error).message);
			errorMessage = (error as Error).message || 'An unknown error occurred';
		}
	}
</script>

<TabGroup>
	<Tab bind:group={tabSet} name="tab1" value={0}>Login</Tab>
	<Tab bind:group={tabSet} name="tab2" value={1}>Sign-Up</Tab>
	<!-- Tab Panels -->
	<svelte:fragment slot="panel">
		<div class="form-container">
			{#if tabSet === 0}
				<!-- Login Form -->
				<div class="card p-6 space-y-5">
					{#if errorMessage}
						<div class="text-red-500">{errorMessage}</div>
					{/if}
					<input
						id="username"
						class="input"
						title="Input (text)"
						type="text"
						placeholder="Username or Email"
						bind:value={username}
					/>
					<input
						id="password"
						class="input"
						title="Input (password)"
						type="password"
						placeholder="Password"
						bind:value={password}
					/>
					<div class="w-full flex justify-end">
						<button type="button" class="btn variant-filled" on:click={handleLogin}>Login</button>
					</div>
				</div>
			{:else if tabSet === 1}
				<!-- Sign-Up Form -->
				<div class="card p-6 space-y-5">
					<input
						id="username"
						class="input"
						title="Input (text)"
						type="text"
						placeholder="Username"
					/>
					<input id="email" class="input" title="Input (email)" type="email" placeholder="Email" />
					<input
						id="password"
						class="input"
						title="Input (password)"
						type="password"
						placeholder="Password"
					/>
					<!-- Add password confirmation field -->
					<input
						id="confirmPassword"
						class="input"
						title="Input (password)"
						type="password"
						placeholder="Confirm Password"
					/>
					<div class="w-full flex justify-end">
						<button type="button" class="btn variant-filled" on:click={handleSignUp}>Sign Up</button
						>
					</div>
				</div>
			{/if}
		</div>
	</svelte:fragment>
</TabGroup>

{#if $isLoggedIn}
	<!-- Logout Button -->
	<div class="w-full flex justify-end">
		<button type="button" class="btn variant-filled" on:click={handleLogout}>Logout</button>
	</div>
{/if}

<style>
	.form-container {
		width: 100%;
		max-width: 400px;
	}
</style>
