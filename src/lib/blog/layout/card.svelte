<script lang="ts">
	import { blur } from 'svelte/transition';
	import { config } from '../config';
	import FallbackImage from '$lib/blog/assets/fallback_image.png';

	interface PostMetadata {
		title: string;
		description: string;
		date: string;
		category: string;
		published: boolean;
		authors: Array<string>;
		reading_time: number;
	}
	interface BlogList {
		meta: PostMetadata;
		slug: string;
		header_image: any;
	}
	export let entry: BlogList;

	// const metadata = entry.meta; //! local, non-reactive snapshot
	//! IF accessed this isnt updated => svelte treats as static!
</script>

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

<style>
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
