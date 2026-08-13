/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        cream: '#FBF7F1',
        paper: '#FFFDF9',
        brown: {
          DEFAULT: '#4A2C1A',
          muted: '#6B4A35',
          light: '#8B6B52',
        },
        gold: {
          DEFAULT: '#C2410C',
          soft: '#EA580C',
        },
        sand: '#F3E6D6',
      },
    },
  },
  plugins: [],
};
