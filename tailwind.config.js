/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#16A34A',
          50:  '#F0FDF4',
          100: '#DCFCE7',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
        },
        secondary: {
          DEFAULT: '#F59E0B',
          500: '#F59E0B',
          600: '#D97706',
        },
        danger: {
          DEFAULT: '#DC2626',
          500: '#EF4444',
          600: '#DC2626',
        },
      },
    },
  },
  plugins: [],
};
