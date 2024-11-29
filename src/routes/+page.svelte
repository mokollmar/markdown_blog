<script lang="ts">
	import { onMount } from 'svelte';
	import { blur } from 'svelte/transition';
	import FallbackImage from '$lib/assets/fallback_image.png';

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

	let blog_list: Array<Post> | undefined = data?.posts;

	onMount(() => {
		console.log(data);
		console.log(blog_list);
	});
</script>

{#if blog_list}
	<div class="flex flex-col">
		<h1 class="my-5 text-center text-5xl">My Blog</h1>

		{#each blog_list as article}
			<a
				id="card"
				href={`/${article.slug}`}
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
