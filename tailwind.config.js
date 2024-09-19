/** @type {import('tailwindcss').Config} */
module.exports = {
  content:  ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        'gaming': ['"Press Start 2P"', 'cursive'],
        'honk' : ['"Honk"']
      }
    },
  },
  plugins: [],
}

