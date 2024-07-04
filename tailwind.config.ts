import type { Config } from 'tailwindcss';

const config: Config = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic':
					'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
			},
			boxShadow: {
				'neon-yellow':
					'0 0 5px #FFF455, 0 0 10px #FFF455, 0 0 20px #FFF455, 0 0 30px #FFF455, 0 0 40px #FFF455, 0 0 50px #FFF455, 0 0 60px #FFF455',
			},
		},
	},
	plugins: [],
};
export default config;
