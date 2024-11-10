import { join } from 'path';
import aspectRatio from '@tailwindcss/aspect-ratio';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

// 1. Import the Skeleton plugin
import { skeleton } from '@skeletonlabs/tw-plugin';

export default {
	// 2. Opt for dark mode to be handled via the class method
	darkMode: 'selector',

	content: ['./src/**/*.{html,js,svelte,ts}',
	// 3. Append the path to the Skeleton package
		join(require.resolve(
			'@skeletonlabs/skeleton'),
			'../**/*.{html,js,svelte,ts}'
		)],

	theme: {
		screens: {
			'sm': '640px',
			// => @media (min-width: 640px) { ... }

			'md': '768px',
			// => @media (min-width: 768px) { ... }

			'lg': '1024px',
			// => @media (min-width: 1024px) { ... }

			'xl': '1280px',
			// => @media (min-width: 1280px) { ... }
		},
		extend: {
			shadow: {
				'3xl': '0 1rem 1rem rgba(0, 0, 0, 0.25)',
			}
		}
	},

	plugins: [typography, forms, aspectRatio, skeleton({
		themes: { preset: [ "vintage", "hamlindigo" ] }
	})]
} satisfies Config;
