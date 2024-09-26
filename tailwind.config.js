/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1DA1F2",
        secondary: "#14171A",
      },
      spacing: {
        128: "32rem",
        144: "36rem",
      },
    },
  },
  plugins: [],
};
