<script lang="ts">
	import { onMount } from 'svelte';

	export let searchTerm: string;
	let isMounted: boolean = false;

	onMount(() => {
		isMounted = true;
	});
</script>

{#if isMounted}
	<div class="search flex w-full items-center justify-center">
		<form class="flex w-full flex-row items-center justify-center">
			<div class="relative">
				<input
					id="input"
					bind:value={searchTerm}
					placeholder="What are you looking for?"
					autocomplete="off"
					spellcheck="false"
					type="search"
					class="w-full rounded-full border-4 px-5 py-2 text-lg outline-none focus:outline-none sm:h-16 sm:w-[40rem] sm:rounded-l-full"
				/>
				<button
					id="button"
					class="absolute right-0 top-0 hidden h-16 rounded-r-full border-4 py-1 pl-6 pr-8 text-lg font-bold sm:block"
					>Search</button
				>
			</div>
		</form>
	</div>
{/if}

<style>
	#input {
		border: 5px rgb(250 116 139) solid;
	}
	#button {
		background-color: rgb(250 116 139);
		border: 5px rgb(250 116 139) solid;
	}
</style>
