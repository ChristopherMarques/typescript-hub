/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./web/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#ecfdf5",
          100: "#d1fae5",
          400: "#34d399",
          500: "#10b981", // Mintlify emerald
          600: "#059669",
          700: "#047857",
        },
        surface: {
          DEFAULT: "#0f141c",
          subtle: "#161d27",
          border: "#232e3d",
          muted: "#94a3b8",
        },
      },
    },
  },
  plugins: [],
};

