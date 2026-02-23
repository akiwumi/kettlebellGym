/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        butter: "#ffe6a7",
        peach: "#ffd7c5",
        mint: "#d9f3e3",
        lavender: "#e7dcff",
        sky: "#cfe6ff",
        mist: "#eff4fb",
        ice: "#e8f1ff",
        ink: "#1d2b44",
        muted: "#5b6b83",
        night: "#0b1220",
        deep: "#0f172a",
      },
      boxShadow: {
        soft: "0 14px 40px -28px rgba(17, 30, 52, 0.45)",
        card: "0 20px 60px -36px rgba(11, 18, 32, 0.55)",
      },
    },
  },
  plugins: [],
};