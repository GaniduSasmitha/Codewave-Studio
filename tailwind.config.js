/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#0A0A0F",
        primary: "#6366F1",
        accent: "#22D3EE",
      },
    },
  },
  plugins: [],
}
