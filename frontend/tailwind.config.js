/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        meil: {
          navy: {
            DEFAULT: '#1A2A6C',
            950: '#07111e',
            900: '#1A2A6C',
            800: '#0f2744',
            700: '#1b3b65',
            600: '#254e85',
            100: '#e8eff8',
            50: '#f1f6fc',
          },
          red: {
            DEFAULT: '#EF272E',
            600: '#EF272E',
            700: '#d11b22',
          },
          emerald: {
            900: '#064e3b',
            800: '#065f46',
            700: '#047857',
            600: '#059669',
            500: '#10b981',
            400: '#34d399',
            100: '#d1fae5',
            50: '#ecfdf5',
          },
          lightgray: '#E8E8E8',
          charcoal: '#333333',
          muted: '#C6CBE6',
        }
      },
      fontFamily: {
        sans: ['Arial', 'Helvetica', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
