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
            DEFAULT: '#313490',
            logo: '#2F3192',
            950: '#0c0e2b',
            900: '#313490',
            800: '#25276e',
            700: '#1e2056',
            600: '#3b3fb0',
            100: '#e8eff8',
            50: '#f1f4fc',
          },
          red: {
            DEFAULT: '#E91029',
            logo: '#EE1D24',
            600: '#E91029',
            700: '#c40d22',
            50: '#FFF7F9',
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
          sky: '#A2DDFF',
          tint: '#FFF7F9',
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
