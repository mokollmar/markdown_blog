import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
	extensions: [".md"],
	layout: {
		blog: "src/lib/BlogPost.svelte",
		_: "src/lib/BlogPost.svelte",
	},
	remarkPlugins: [],
}


/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess({ script: true }), mdsvex(mdsvexOptions)],
	kit: {
		adapter: adapter()
	},
	extensions: ['.svelte', '.svx', '.md']
};

export default config;
