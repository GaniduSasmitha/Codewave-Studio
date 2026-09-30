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
        background: "#0B132B", // Deep Midnight Navy
        balsamico: "#0B132B",
        surface: "#131B2E",    // Royal Navy Surface
        coffee: "#131B2E",
        border: "#1E3A5F",     // Royal Navy Border
        muted: "#8496B8",      // Muted Slate Navy
        primary: "#D4AF37",    // Royal Gold
        accent: "#F3C623",     // Vibrant Royal Gold
        champagne: "#F9E79F",  // Light Gold / Champagne
        navy: {
          950: "#070D1D",
          900: "#0B132B",
          800: "#131B2E",
          700: "#1C2541",
          600: "#1E3A5F",
          500: "#2A4B7C",
          100: "#E2E8F0",
        },
        gold: {
          900: "#7A5C07",
          800: "#AA7C11",
          700: "#B8860B",
          600: "#C5A059",
          500: "#D4AF37",
          400: "#F3C623",
          300: "#F5C518",
          200: "#F9E79F",
          100: "#FEF9E7",
        }
      },
    },
  },
  plugins: [],
}
