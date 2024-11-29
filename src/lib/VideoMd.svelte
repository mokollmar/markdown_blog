<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	export let src: string;
	let theSlug: string;

	onMount(() => (theSlug = $page.url.pathname.split('/')[2]));
</script>

{#if theSlug}
	<div class="w-full py-12 flex justify-center items-center">
		<iframe
			src={src.includes('youtube')
				? `${src}?&controls=0&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1&loop=1&cc_load_policy=0?vq=hd1080`
				: src}
			title="YouTube video player"
			frameborder="0"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
			referrerpolicy="strict-origin-when-cross-origin"
			class="rounded-lg overflow-clip w-full min-h-[30rem] max-h-screen my-12 border-4 border-overred-red border-opacity-80"
			allowfullscreen
		></iframe>
	</div>
{/if}
