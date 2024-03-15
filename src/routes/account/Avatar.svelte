<script lang="ts">
	import type { SupabaseClient } from '@supabase/supabase-js';
	import { createEventDispatcher } from 'svelte';

	export let size = 10;
	export let url: string;
	export let supabase: SupabaseClient;

	let avatarUrl: string | null = null;
	let uploading = false;
	let files: FileList;

	const dispatch = createEventDispatcher();

	const downloadImage = async (path: string) => {
		try {
			if (path) {
				const { data, error } = await supabase.storage.from('avatars').download(path);
				if (error) throw error;
				avatarUrl = URL.createObjectURL(data);
			} else {
				// No path provided, show placeholder
				avatarUrl = null;
			}
		} catch (error) {
			console.error('Error downloading image:', error instanceof Error ? error.message : error);
		}
	};

	const uploadAvatar = async () => {
		try {
			uploading = true;

			if (!files || files.length === 0) {
				throw new Error('You must select an image to upload.');
			}

			const file = files[0];
			const fileExt = file.name.split('.').pop();
			const filePath = `${Math.random()}.${fileExt}`;

			const { error } = await supabase.storage.from('avatars').upload(filePath, file);

			if (error) {
				throw error;
			}

			url = filePath;
			setTimeout(() => {
				dispatch('upload');
			}, 100);
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
			}
		} finally {
			uploading = false;
		}
	};

	$: if (url) downloadImage(url);
</script>

<div class="grid gap-2 items-center justify-center">
	{#if avatarUrl}
		<img
			src={avatarUrl}
			alt="Avatar"
			class="rounded-full object-cover"
			style="height: {size}em; width: {size}em;"
		/>
	{:else}
		<div
			class="rounded-full bg-gray-200 animate-pulse"
			style="height: {size}em; width: {size}em;"
		></div>
	{/if}
	<input type="hidden" name="avatarUrl" value={url} />

	<label class="btn variant-filled cursor-pointer" for="single">
		{uploading ? 'Uploading ...' : 'Upload Avatar'}
	</label>
	<input
		type="file"
		id="single"
		accept="image/*"
		bind:files
		on:change={uploadAvatar}
		disabled={uploading}
		style="display: none;"
	/>
</div>

<style>
	.rounded-full {
		border-radius: 9999px;
	}
</style>
