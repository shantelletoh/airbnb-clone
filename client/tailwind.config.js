/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // initialize own colors
        primary: "#F5385D",
        primaryButton: "#F5385D",
      },
    },
  },
  plugins: [],
};
