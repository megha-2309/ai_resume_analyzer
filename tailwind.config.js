/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'badge-green': '#dcfce7',
        'badge-green-text': '#166534',
        'badge-yellow': '#fef9c3',
        'badge-yellow-text': '#854d0e',
        'badge-red': '#fee2e2',
        'badge-red-text': '#991b1b',
      }
    },
  },
  plugins: [],
}

