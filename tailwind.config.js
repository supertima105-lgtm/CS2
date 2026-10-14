/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        csdark: {
          950: '#0d0d0f',
          900: '#121214',
          850: '#17171a',
          800: '#1e1e23',
          700: '#2b2b33',
          600: '#3e3e4a',
        },
        csorange: {
          DEFAULT: '#f59e0b',
          light: '#fbbf24',
          dark: '#d97706',
          neon: '#ff7a00',
        },
        csterror: '#f59e0b', // Terrorist Amber
        csct: '#38bdf8',     // Counter-Terrorist Ice Blue
      },
      fontFamily: {
        tactical: ['Chakra Petch', 'Rajdhani', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-orange': '0 0 20px -3px rgba(245, 158, 11, 0.35)',
        'glow-ct': '0 0 20px -3px rgba(56, 189, 248, 0.35)',
      }
    },
  },
  plugins: [],
}
