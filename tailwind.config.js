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
        background: "#0A0F12",
        surface: "#20292D",
        border: "#394045",
        muted: "#565A5C",
        grapple: "#907768",
        primary: "#A33715",
        accent: "#907768",
        salsa: "#A33715",
        networker: "#B5A295",
      },
    },
  },
  plugins: [],
}
