/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // 👈 CLAVE para modo oscuro manual
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};