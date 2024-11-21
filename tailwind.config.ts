import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';
import { join } from 'path';
import { skeleton } from '@skeletonlabs/tw-plugin';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}', join(require.resolve(
		'@skeletonlabs/skeleton'),
		'../**/*.{html,js,svelte,ts}'
	)],

	theme: {
		extend: {}
	},

	plugins: [typography, forms, skeleton]
} satisfies Config;
