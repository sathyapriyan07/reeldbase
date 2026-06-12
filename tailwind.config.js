/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        reel: {
          50: '#f8f7f4',
          100: '#efece3',
          200: '#ddd7c5',
          300: '#c8bda1',
          400: '#b4a47f',
          500: '#a59069',
          600: '#987f5b',
          700: '#7f674d',
          800: '#685443',
          900: '#56463a',
          950: '#2f261e',
        },
        dark: {
          50: '#f8f9fa',
          100: '#f1f3f5',
          200: '#e9ecef',
          300: '#dee2e6',
          400: '#ced4da',
          500: '#adb5bd',
          600: '#6c757d',
          700: '#495057',
          800: '#343a40',
          850: '#2b3035',
          900: '#1e1e1e',
          950: '#0d0d0d',
        },
      },
      fontFamily: {
        sans: ['Pliant', 'system-ui', 'sans-serif'],
        display: ['Pliant', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
