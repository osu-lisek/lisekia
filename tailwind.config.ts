import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {

    extend: {
      colors: {
        "background": {
          '50': '#f6f6f6',
          '100': '#e7e7e7',
          '200': '#d1d1d1',
          '300': '#b0b0b0',
          '400': '#888888',
          '500': '#6d6d6d',
          '600': '#5d5d5d',
          '700': '#4f4f4f',
          '800': '#454545',
          '900': '#3d3d3d',
          '950': '#1b1b1b',
        },
        'mine-shaft': {
          '50': '#f6f6f6',
          '100': '#e7e7e7',
          '200': '#d1d1d1',
          '300': '#b0b0b0',
          '400': '#888888',
          '500': '#6d6d6d',
          '600': '#5d5d5d',
          '700': '#4f4f4f',
          '800': '#454545',
          '900': '#3d3d3d',
          '950': '#2b2b2b',
        },
        'tuatara': {
          '50': '#f6f6f6',
          '100': '#e7e7e7',
          '200': '#d1d1d1',
          '300': '#b0b0b0',
          '400': '#888888',
          '500': '#6d6d6d',
          '600': '#5d5d5d',
          '700': '#4f4f4f',
          '800': '#454545',
          '900': '#3b3b3b',
          '950': '#262626',
        },
        'primary': {
          '50': '#edf8ff',
          '100': '#d7eeff',
          '200': '#b9e3ff',
          '300': '#88d3ff',
          '400': '#50baff',
          '500': '#2899ff',
          '600': '#1d81ff',
          '700': '#0a62eb',
          '800': '#0f4fbe',
          '900': '#134695',
          '950': '#112b5a',
        },
        'royal-blue': {
          '50': '#eef3ff',
          '100': '#e0e9ff',
          '200': '#c6d6ff',
          '300': '#a4b9fd',
          '400': '#8093f9',
          '500': '#5865f2',
          '600': '#4445e7',
          '700': '#3836cc',
          '800': '#2f2fa4',
          '900': '#2d2f82',
          '950': '#1a1a4c',
        },
      },
      objectPosition: {
        'almost-top': '0 -2.5rem',
      }
    },
  },
  plugins: [
    require('tailwindcss-dotted-background'),
    require('tailwindcss-animated')
  ],
}
export default config
