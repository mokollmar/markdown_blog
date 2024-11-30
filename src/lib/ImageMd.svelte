<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { config } from '$lib/config';

	export let src: string;
	export let alt: string | null;

	let slug: string;
	let cut_index: number = (config.blogUrl.match('/')?.length ?? 0) + 1;

	onMount(() => (slug = $page.url.pathname.split('/')[cut_index]));
</script>

{#if slug}
	<div class="flex w-full items-center justify-center py-12">
		<img
			src={src.includes('://') ? src : `/src/posts/${slug}/images/${src}`}
			class="border-overred-red max-h-screen overflow-hidden rounded-lg border-4 border-opacity-80 object-contain"
			{alt}
		/>
	</div>
{/if}
