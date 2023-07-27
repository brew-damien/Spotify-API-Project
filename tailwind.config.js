/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,html}'],
  theme: {
    extend: {
      screens: {
        'xs': { 'max': '499px' },
      },
      colors: {
        spotifyGreen: "#1db954",
      }
    },
  },
  plugins: [],
}

