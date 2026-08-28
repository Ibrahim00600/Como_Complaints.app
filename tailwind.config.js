/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx,mdx}',
    './pages/**/*.{js,jsx,ts,tsx,mdx}',
    './app/**/*.{js,jsx,ts,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#002B49', // university primary color
          dark: '#001A2C',
          light: '#004A7C',
        },
        gold: {
          DEFAULT: '#C8A362', // logo accent color
          dark: '#9A7B44',
          light: '#E6C68A',
        }
      },
    },
  },
  plugins: [],
};
