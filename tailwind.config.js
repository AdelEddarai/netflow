/** @type {import('tailwindcss').Config} */

import { withUt } from 'uploadthing/tw';

const config = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			keyframes: {
				starScale: {
					"from, to": {
					  transform: "rotate(0) scale(0)",
					  opacity: 0,
					},
					"50%": {
					  transform: "rotate(180deg) scale(1)",
					  opacity: 1,
					},
				},
				accordionDown: {
					from: { height: 0 },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				accordionUp: {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: 0 },
				},
				animatedBeam: {
					"100%": { offsetDistance: "100%" },
				},
			},
			animation: {
				starScale: "starScale 800ms ease infinite",
				accordionDown: 'accordion-down 0.2s ease-out',
				accordionUp: 'accordion-up 0.2s ease-out',
				animatedBeam: "animatedBeam 7s linear infinite",
			},
		},
	},
	plugins: [
		require('tailwindcss-animate'),
		require('tailwind-scrollbar'),
		require('@tailwindcss/typography'),
	],
};

export default withUt(config);
