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
        background: "#150C0C", // Balsamico
        balsamico: "#150C0C",
        surface: "#34150F",    // Burnt Coffee
        coffee: "#34150F",
        border: "#54281B",     // Warm Coffee Border
        muted: "#B58E78",      // Muted Warm Text
        primary: "#85431E",    // Honey Garlic
        accent: "#D39858",     // Whiskey Sour
        champagne: "#EACEAA",  // Champagne
      },
    },
  },
  plugins: [],
}
