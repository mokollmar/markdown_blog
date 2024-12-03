<script lang="ts">
	import { blur } from 'svelte/transition';
	import FallbackImage from '$lib/assets/fallback_image.png';
	import { config } from '$lib/config.js';
	import { afterNavigate, replaceState } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	interface Post {
		title: string;
		description: string;
		date: string;
		category: string;
		published: boolean;
		authors: Array<string>;
		reading_time: number;
		slug: string | null;
		content: string | null;
		header_image: any;
	}

	export let data;

	let blog_list: Array<Post> | undefined = data.posts

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
		if (!blog_list) return;
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
		const params = new URLSearchParams($page.url.search);
		const tag_param = params.get('tag');
		if (tag_param) selectCategory(tag_param);
		else filterList(FilterBy.Date);
	});
</script>

{#if blog_list}
	<div class="flex flex-col">
		<h1 class="my-5 text-center text-5xl">My Blog</h1>

		<!-- Categories: -->
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

		{#each blog_list as article}
			<a
				id="card"
				href={`${config.blogUrl}/${article.slug}`}
				in:blur={{ delay: 500, duration: 500 }}
				out:blur={{ duration: 500 }}
				class="space-y-5 p-3"
			>
				<img
					src={article?.header_image ?? FallbackImage}
					style="aspect-ratio: 4/5;"
					class="w-full rounded-md object-cover"
					alt="my_image"
				/>

				<div class="flex flex-col items-start justify-center space-y-3 px-6 pb-2 text-start">
					<p class="text-overred-red line-clamp-1 text-lg font-medium text-opacity-80">
						{article.category.toString().toUpperCase()}
					</p>
					<p
						style="min-height: 2.5rem;"
						class="text-overred-variant-blue flex items-center justify-start text-start text-2xl font-medium"
					>
						{@html article.title}
					</p>
					<p style="min-height: 4rem;" class="text-md line-clamp-3">
						{@html article.description}
					</p>

					<div class="flex flex-row items-center justify-center space-x-3 pt-2">
						<div class="flex flex-col">
							<p class="text-overred-variant-blue text-sm font-semibold italic text-opacity-80">
								{@html `It's me!`}
							</p>
							<div class="text-overred-variant-blue flex flex-row text-sm text-opacity-70">
								<p class="italic">{`${article.date}`}</p>
								<span class="flex items-center justify-center px-1">&bull;</span>
								<p class="italic">{`${article.reading_time} min`}</p>
							</div>
						</div>
					</div>
				</div>
			</a>
		{/each}
	</div>
{/if}
