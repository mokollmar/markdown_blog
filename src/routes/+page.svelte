<script lang="ts">
	import { afterNavigate, replaceState } from '$app/navigation';
	import { startIndexing, type PostMetadata, type SearchPost } from '$lib/blog/search/search';
	import SearchBar from '$lib/blog/search/searchBar.svelte';
	import CardWrapper from '$lib/blog/layout/cardWrapper.svelte';
	import Card from '$lib/blog/layout/card.svelte';
	import { page } from '$app/stores';

	interface BlogArticle {
		meta: PostMetadata;
		slug: string;
		header_image: any;
	}

	export let data: any;
	const search_obj: Array<SearchPost> | null = data.search_obj;

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
		const _search_obj = blog_list.map(({ slug, header_image, meta }) => ({
			slug,
			header_image,
			...meta
		}));
		console.error('HERE');
		console.log(_search_obj);
		if (searchTerm && blog_list) startIndexing(_search_obj);
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

	let searchTerm = '';

	afterNavigate(() => {
		didNavigate = true;

		const params = new URLSearchParams($page.url.search);
		const tag_param = params.get('tag');
		const q_param = params.get('q');

		// get search params
		if (q_param) searchTerm = q_param;
		if (q_param) startIndexing(search_obj);
		if (tag_param) selectCategory(tag_param);
		else filterList(FilterBy.Date);
	});

	// update SearchParams:
	let _o_searchTerm: string = '';
	$: if (searchTerm != _o_searchTerm && didNavigate) {
		startIndexing(search_obj);
		$page.url.searchParams.set('q', searchTerm);
		try {
			replaceState($page.url, $page.state);
		} catch (error) {
			console.log("Couldn't change url");
		}
		_o_searchTerm = searchTerm;
		const results = searchTerm(searchTerm as string);
		blog_list = results.map(({ slug, header_image, ...meta }: BlogArticle) => ({
			meta,
			slug: slug ?? '/',
			header_image
		}));
		blog_list = [...blog_list];
	}
</script>

<div
	class="flex h-full w-full flex-col items-center justify-center rounded-lg border-opacity-50 p-12 text-sm transition-all duration-500"
>
	<!-- Search input -> mobile -->
	<SearchBar bind:searchTerm />

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
