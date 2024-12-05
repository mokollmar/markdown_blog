<script lang="ts">
	import { page } from '$app/stores';
	import { afterNavigate, replaceState } from '$app/navigation';
	import CardWrapper from '$lib/blog/layout/cardWrapper.svelte';
	import Card from '$lib/blog/layout/card.svelte';

	interface PostMetadata {
		title: string;
		description: string;
		date: string;
		category: string;
		published: boolean;
		authors: Array<string>;
		reading_time: number;
	}

	interface BlogArticle {
		meta: PostMetadata;
		slug: string;
		header_image: any;
	}

	export let data: any;
	let blog_list: Array<BlogArticle>;

	let didNavigate: boolean = false;

	enum FilterBy {
		Date,
		Comparison,
		News
	}
	let categories = [
		{ title: 'Latest', state: true, key: 'date' },
		{ title: 'Comparison', state: false, key: 'comparison' },
		{ title: 'News', state: false, key: 'news' }
	];
	function filterList(filter: FilterBy) {
		blog_list = data.posts;

		if (filter === FilterBy.Date) {
			blog_list = [...blog_list].sort((a, b) => {
				const aa_data = a.meta.date.split('.');
				const bb_data = b.meta.date.split('.');
				const a_date = new Date(Number(aa_data[2]), Number(aa_data[1]), Number(aa_data[0]));
				const b_date = new Date(Number(bb_data[2]), Number(bb_data[1]), Number(bb_data[0]));
				return a_date.getTime() - b_date.getTime();
			});
		} else if (filter === FilterBy.Comparison) {
			blog_list = [...blog_list].filter((element) => {
				return element.meta.category === 'comparison';
			});
		} else if (filter === FilterBy.News) {
			blog_list = [...blog_list].filter((element) => {
				return element.meta.category === 'news';
			});
		}
	}
	function selectCategory(key: string | null) {
		if (!key) return;
		categories.forEach((element) => {
			if (element.key === key) {
				element.state = true;
			} else {
				element.state = false;
			}
		});
		categories = [...categories];
		switch (key) {
			case 'comparison':
				filterList(FilterBy.Comparison);
				break;
			case 'news':
				filterList(FilterBy.News);
				break;
			case 'date':
				filterList(FilterBy.Date);
				break;
		}
		$page.url.searchParams.set('tag', key);
		try {
			replaceState($page.url, $page.state);
		} catch (error) {
			console.log("Couldn't change url");
		}
	}

	afterNavigate(() => {
		didNavigate = true;

		// get params:
		const params = new URLSearchParams($page.url.search);
		const tag_param = params.get('tag');
		if (tag_param) selectCategory(tag_param);
		else filterList(FilterBy.Date);
	});
</script>

<div
	class="flex h-full w-full flex-col items-center justify-center rounded-lg border-opacity-50 p-12 text-sm transition-all duration-500"
>
	{#if didNavigate}
		<div
			class="my-6 flex w-full flex-row justify-between space-x-3 overflow-x-scroll px-6 sm:mx-[5%] sm:my-12 sm:w-min sm:space-x-24 sm:px-0"
		>
			{#each categories as catgy}
				<button
					id="category_btn"
					on:click={() => selectCategory(catgy.key)}
					class={`${catgy.state ? 'active_X' : ''} flex items-center justify-center py-2 text-center text-xl font-semibold`}
				>
					{catgy.title}
				</button>
			{/each}
		</div>
		{#if blog_list?.length}
			<CardWrapper>
				{#each blog_list as entry}
					<Card {entry} />
				{/each}
			</CardWrapper>
		{:else}
			<div
				style="color: rgb(250, 116, 139);"
				class="flex min-h-[50vh] flex-grow flex-col items-center justify-center text-2xl font-bold sm:text-3xl"
			>
				Nothing found, ¯\\_(ツ)_/¯
			</div>
		{/if}
	{/if}
</div>

<style>
	#category_btn {
		border: 5px rgb(203 213 225) solid;
		border-radius: 10px;
		max-width: 100%;
		width: 250px;
		transition: all;
		transition-duration: 250ms;
	}
	#category_btn:hover {
		border: 5px rgb(250 116 139) solid;
	}
	#category_btn.active_X {
		border: 5px rgb(250 116 139) solid;
	}
</style>
