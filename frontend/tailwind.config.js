/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        primary: "#FC72FF",
        secondary: "#2ABDFF",
        error: "#E32B2B",
        dark: "#131313",
      },
    },
  },
  plugins: [],
};
