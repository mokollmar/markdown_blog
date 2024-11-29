<script lang="ts">
	import FallbackImage from '$lib/blog/assets/fallback_image.png';
	import { onMount } from 'svelte';
	import Breadcrumb from '$lib/Breadcrumb.svelte';
	import Socials from '$lib/Socials.svelte';
	import { page } from '$app/stores';
	import { exportTOC, type ContentEntry } from '$lib/func';

	export let data: any;

	const metadata = data.props.meta;
	const category = capitalize(data.props.meta.category.toString());

	function capitalize(x: string) {
		return x.charAt(0).toUpperCase() + x.slice(1);
	}

	let heading_id = '';
	$: console.log(`Heading ID update: ${heading_id}`);

	// TOC List
	let toc_list: Array<ContentEntry> | null = null;
	let in_heading_pos: boolean | null = null;
	onMount(() => updateTOC(null));
	onMount(() => {
		requestAnimationFrame(() => {
			addEventListener('scroll', (event) => {
				in_heading_pos = false;
				updateTOC(event);
			});
		});
	});
	onMount(() => {
		toc_list = exportTOC();
		console.log(toc_list);
	});
	onMount(() => {
		console.log(`Url: ${$page.url.href}`);
	});

	function updateTOC(event: Event | null) {
		const article = document.getElementById('blog-article');
		if (!article) return;
		const headings = article.getElementsByTagName('h2');
		let h2_array: Array<string> = [];
		for (let index = 0; index < headings.length; index++) {
			const element = headings[index];
			h2_array.push(element.id);
		}

		[...h2_array] = h2_array.sort(sortByPosition);

		function sortByPosition(a: string, b: string) {
			const a_ele = document.getElementById(a);
			const b_ele = document.getElementById(b);
			if (!a_ele || !b_ele) return 0;

			const a_rect = a_ele.getBoundingClientRect();
			const b_rect = b_ele.getBoundingClientRect();

			const a_top = a_rect.top < 5 ? Infinity : a_rect.top;
			const b_top = b_rect.top < 5 ? Infinity : b_rect.top;

			return a_top - b_top;
		}
		heading_id = h2_array[0];

		// Scroll TOC
		if (!event) return;
		const perc_scroll = window.scrollY / document.body.scrollHeight;
		console.log(`Scrolled ${perc_scroll}% of the main window`);
		const toc = document.getElementById('article-toc');
		console.log('TOC:');
		console.log(toc);
		if (!toc) return;
		console.log('Found it!');
		const scroll_position: number = (toc?.scrollHeight ?? 0) * perc_scroll;
		toc?.scrollTo(0, scroll_position);
	}
</script>

<div class="flex w-full scroll-mt-[100px] flex-col scroll-smooth">
	<!-- Header -->
	<div
		class="flex w-full flex-col content-center justify-center space-x-10 overflow-clip border-b-2 border-opacity-80 px-10 sm:mx-auto sm:h-96 sm:flex-row sm:space-x-20 sm:px-20 sm:pb-5 lg:w-[90%] xl:w-[75%] 2xl:w-[66%]"
	>
		<img
			src={data.props?.header_image ?? FallbackImage}
			style={`aspect-ratio: 4/5;`}
			class="my-6 rounded-xl bg-indigo-500 object-cover"
			alt="my_image"
		/>

		<div
			style={`aspect-ratio: 4/5;`}
			class="space-y-30 left-0 my-6 flex flex-col justify-center text-left"
		>
			<Breadcrumb metadata_category={metadata.category} metadata_name={category} />
			<h1
				class="text-overred-variant-blue flex grow items-center justify-center text-left text-3xl font-bold sm:text-5xl"
				data-toc-ignore
			>
				{metadata.title}
			</h1>

			<div class="flex w-full flex-col items-center justify-start pt-5 sm:flex-col sm:pt-0">
				<div
					class="flex w-full flex-row items-start justify-start space-x-3 pr-2 opacity-80 sm:pr-0 sm:pt-2"
				></div>
				<!-- Date & Reading Time -->
				<div
					class="text-overred-variant-blue sm:text-md flex w-full flex-row items-start justify-start text-sm opacity-30 sm:pt-3"
				>
					<p class="italic">Updated:</p>
					<span class="px-1"></span>
					<p class="italic">{`${metadata.date}`}</p>
					<span class="flex items-center justify-center px-2">&bull;</span>
					<p class="hidden italic sm:block">Reading Time:</p>
					<p class="lock italic sm:hidden">Time:</p>
					<span class="px-1"></span>
					<p class="italic">{`${metadata.reading_time} min`}</p>
				</div>
			</div>
		</div>
	</div>

	<div class="mt-12 flex w-full flex-row justify-center">
		<!-- TOC -->
		<div class="mx-10 hidden justify-start py-12 opacity-80 sm:flex lg:w-[20%] 2xl:w-[15%]">
			<div class="sticky top-10 flex h-[25rem] w-full flex-col space-y-2 font-semibold">
				<h3 class="px-2 text-2xl">Content</h3>
				<div
					id="article-toc"
					class="flex scroll-m-0 flex-col space-y-5 overflow-y-scroll rounded-lg border-4 border-opacity-25 px-2 py-5 opacity-80 transition-all duration-200"
				>
					{#if toc_list}
						{#each toc_list as entry}
							<a
								href={`#${entry.id}`}
								class={$page.url.href.toString().includes(entry.id) && in_heading_pos !== false
									? 'text-md  w-full rounded-lg bg-slate-400 px-3 py-2'
									: 'text-md w-full rounded-lg bg-slate-200 px-3 py-2 hover:bg-slate-400'}
								>{entry.title}</a
							>
						{/each}
					{/if}
				</div>

				<!-- HERE, the currently acitve element from above + scroll!! -->
			</div>
		</div>

		<article
			id="blog-article"
			style="scroll-behavior: smooth; scroll-padding: 50px;"
			class="prose mx-8 mb-3 flex w-full max-w-none grow justify-start rounded-xl bg-white pt-0 sm:mx-auto sm:border-4 sm:p-20"
		>
			<svelte:component this={data.props.content} />
		</article>

		<!-- Share -->
		<div class="mx-10 hidden justify-start py-12 opacity-80 sm:flex lg:w-[20%] 2xl:w-[15%]">
			<div class="sticky top-10 flex h-min w-full flex-col space-y-5 overflow-y-scroll">
				<Socials type="twitter" title={metadata.title} />
				<Socials type="reddit" title={metadata.title} />
				<Socials type="facebook" title={metadata.title} />
				<Socials type="tumblr" title={metadata.title} />
				<Socials type="linkedin" title={metadata.title} />
			</div>
		</div>
	</div>
</div>
