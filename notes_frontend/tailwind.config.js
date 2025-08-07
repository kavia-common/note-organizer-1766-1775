module.exports = {
  content: [
    './components/**/*.{vue,js,ts}',
    './pages/**/*.{vue,js,ts}',
    './app.vue',
    './layouts/**/*.vue',
  ],
  theme: {
    colors: {
      accent: "#10B981",
      primary: "#4F46E5",
      secondary: "#F59E42",
      white: "#fff",
      black: "#000",
      gray: {
        50: "#F9FAFB",
        100: "#F1F5F9",
        200: "#E5E7EB",
        300: "#D1D5DB",
        400: "#9CA3AF",
        500: "#6B7280",
        600: "#4B5563",
        700: "#374151",
        800: "#1F2937",
        900: "#111827",
      },
      transparent: "transparent",
      current: "currentColor"
    },
    extend: {},
  },
  plugins: [],
};
