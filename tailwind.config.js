/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{njk,html,js}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', "serif"],
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        black: "#0a0a0a",
        white: "#f5f5f5",
        gray: {
          400: "#9a9a9a",
          600: "#555555",
          800: "#1a1a1a",
          900: "#111111",
        },
      },
    },
  },
  plugins: [],
};
