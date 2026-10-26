/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        burkert: {
          50: '#e8f2fb',
          100: '#cfe0f5',
          200: '#9bc1ea',
          300: '#5f9bd9',
          400: '#2a78c4',
          500: '#006bb3',
          600: '#004B93',
          700: '#003d76',
          800: '#002f5c',
          900: '#001f40',
          950: '#001429',
        },
        eco: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
