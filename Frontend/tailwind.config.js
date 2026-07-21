/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        sidebar: "#13111c", // near-black navy sidebar background
        brand: {
          light: "#ede9fe",
          DEFAULT: "#7c3aed",
          dark: "#6d28d9",
        },
      },
    },
  },
  plugins: [],
};
