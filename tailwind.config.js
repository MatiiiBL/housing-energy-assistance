/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf8',
          100: '#dcfcee',
          200: '#bbf7de',
          300: '#86efbf',
          400: '#4ade9a',
          500: '#1D9E75',
          600: '#178a65',
          700: '#126e52',
          800: '#0f5841',
          900: '#0c4734',
        },
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite linear',
      },
    },
  },
  plugins: [],
};
