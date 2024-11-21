<script lang="ts">
	import { onMount } from "svelte";

	export let data;

	onMount(() => {
		console.log(data);
	});
</script>

<div class="flex flex-col p-12">
	<h1 class="text-center font-bold text-5xl">{data.props?.meta.title}</h1>
	<article
		id="blog-article"
		style="scroll-behavior: smooth; scroll-padding: 50px;"
		class="prose mx-8 mb-3 flex w-full max-w-none grow justify-start rounded-xl bg-white pt-0 sm:mx-auto sm:border-4 sm:p-20 m-12"
	>
		<svelte:component this={data?.props?.content} />
	</article>
</div>
