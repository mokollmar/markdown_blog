<script lang="ts">
	import { onMount } from "svelte";
	import FallbackImage from "$lib/fallback_image.png";

	export let data;

	onMount(() => {
		console.log(data);
	});
</script>

<div class="flex flex-col justify-center items-center space-y-12 p-12">
	<h1 class="text-center font-bold text-5xl">{data.props?.meta.title}</h1>

	<img
		src={data.props?.header_image ?? FallbackImage}
		style={`aspect-ratio: 4/5;`}
		class="my-6 rounded-xl bg-indigo-500 object-cover"
		alt="my_image"
	/>
	<article class="prose w-full">
		<svelte:component this={data?.props?.content} />
	</article>
</div>
