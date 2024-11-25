<script lang="ts">
	import { onMount } from "svelte";

	export let data../$types.js;

	onMount(() => {
		console.log(data);
	});
</script>

<div class="flex flex-col justify-center items-center space-y-12">
	<h1 class="text-center font-bold text-5xl">{data.props?.meta.title}</h1>
	<article class="prose w-full">
		<svelte:component this={data?.props?.content} />
	</article>
</div>
