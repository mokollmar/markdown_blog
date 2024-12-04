<script lang="ts">
	import { page } from '$app/stores';
	import { afterNavigate, replaceState } from '$app/navigation';
	import { config } from '$lib/config';
	import { blur } from 'svelte/transition';
	import FallbackImage from '$lib/assets/fallback_image.png';

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

	// for search:
	let search: 'loading' | 'ready' = 'loading';
	let searchTerm = '';
	let worker: Worker;
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
			{#each blog_list as entry}
				<a
					id="card"
					href={`${config.blogUrl}/${entry.slug}`}
					in:blur={{ delay: 500, duration: 500 }}
					out:blur={{ duration: 500 }}
					class="space-y-5 p-3"
				>
					<img
						src={entry?.header_image ?? FallbackImage}
						style="aspect-ratio: {config.image_ratio_list};"
						class="w-full rounded-md object-cover"
						alt="my_image"
					/>

					<div class="flex flex-col items-start justify-center space-y-3 px-6 pb-2 text-start">
						<p class="text-overred-red line-clamp-1 text-lg font-medium text-opacity-80">
							{entry.meta.category.toString().toUpperCase()}
						</p>
						<p
							style="min-height: 2.5rem;"
							class="text-overred-variant-blue flex items-center justify-start text-start text-2xl font-medium"
						>
							{@html entry.meta.title}
						</p>
						<p style="min-height: 4rem;" class="text-md line-clamp-3">
							{@html entry.meta.description}
						</p>

						<div class="flex flex-row items-center justify-center space-x-3 pt-2">
							<img
								src={config.profiles[entry.meta.authors[0] ?? '_']['pic']}
								class="h-12 w-12 rounded-full border-2 border-white object-contain"
								alt="my_profile"
							/>

							<div class="flex flex-col">
								<p class="text-overred-variant-blue text-sm font-semibold italic text-opacity-80">
									{@html `${config.profiles[entry.meta.authors[0] ?? '_']['txt']}`}
								</p>
								<div class="text-overred-variant-blue flex flex-row text-sm text-opacity-70">
									<p class="italic">{`${entry.meta.date}`}</p>
									<span class="flex items-center justify-center px-1">&bull;</span>
									<p class="italic">{`${entry.meta.reading_time} min`}</p>
								</div>
							</div>
						</div>
					</div>
				</a>
			{/each}
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
	#card {
		width: 400px;
		max-width: w-full;
		border-radius: 0.5rem;
		border: 5px rgb(203 213 225) solid;
		transition-property: all;
		transition-duration: 500ms;
		margin: 50px;
	}
	#card:hover {
		border: 5px rgb(250 116 139) solid;
		scale: 1.025;
	}
</style>
