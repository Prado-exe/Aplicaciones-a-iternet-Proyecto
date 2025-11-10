/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fabBlack: "#0f0f0f",
        fabGray: "#2b2b2b",
        fabYellow: "#FFD300",
      },
    },
  },
  plugins: [],

  extend: {
  keyframes: {
    pulse: {
      "0%, 100%": { opacity: 1 },
      "50%": { opacity: 0.5 },
    },
  },
  animation: {
    pulse: "pulse 3s ease-in-out infinite",
  },
}

};
