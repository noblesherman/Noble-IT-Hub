/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        blurple: "#5B5BFF",
        appleBlue: "#0A84FF",
        pink: "#FF6DD8",
        cyan: "#34E8E2"
      }
    }
  },
  plugins: [],
}