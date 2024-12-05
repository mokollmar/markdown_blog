import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
	extensions: [".md"],
	layout: {
		_: 'src/lib/blog/layout/post.svelte',
	},
	remarkPlugins: [],
}


/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess({ script: true }), mdsvex(mdsvexOptions),],

	kit: {
		adapter: adapter()
	},

	extensions: ['.svelte', '.svx', '.md']
};

export default config;
