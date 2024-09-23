/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/**/*.{html,js}",
    "./public/js/**/*.{html,js}",
    "./public/index.html",
    join(__dirname, "src/**/*.{js,ts,jsx,tsx}"),
    join(__dirname, "public/**/*.{js,ts,jsx,tsx}"),
    join(__dirname, "a3-eddie048/**/*.{js,ts,jsx,tsx}"),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

console.log("Hello world");
