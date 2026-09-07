/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: "#FAF8F5", // Warm Linen
          alt: "#F3EFEA",     // Raw Canvas
          dark: "#141210",    // Noir Paper
        },
        surface: {
          DEFAULT: "#FFFFFF",
          subtle: "#FDFCFA",
          dark: "#1E1A17",
          darkMuted: "#26221E",
        },
        ink: {
          950: "#120F0E",
          900: "#1A1614",
          800: "#2B2623",
          700: "#3D3631",
          600: "#574E47",
          400: "#8C827A",
          300: "#B0A79F",
          200: "#D3CBC3",
          100: "#EAE5DF",
          50: "#F7F5F2",
        },
        brass: {
          50: "#FAF6EF",
          100: "#F3EBDC",
          200: "#E7D6B9",
          300: "#D7B988",
          400: "#C5A065",
          500: "#B38E58",
          600: "#9A7542",
          700: "#7C5B2E",
          800: "#604420",
          900: "#442E13",
        },
        clay: {
          50: "#FCF5F2",
          100: "#F8E7E0",
          200: "#F0CCC0",
          500: "#A05234",
          600: "#863F24",
          700: "#692F1A",
        },
        sage: {
          50: "#F4F7F4",
          100: "#E6ECE6",
          200: "#CDD8CD",
          500: "#4A5D4E",
          600: "#3C4C3F",
          700: "#303D33",
        },
      },
      fontFamily: {
        serif: ["Fraunces", "Playfair Display", "Georgia", "serif"],
        sans: ["Manrope", "Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Space Mono", "monospace"],
      },
      boxShadow: {
        editorial: "0 1px 3px rgba(26, 22, 20, 0.04), 0 10px 24px -8px rgba(26, 22, 20, 0.05)",
        card: "0 0 0 1px rgba(231, 226, 217, 0.9), 0 2px 8px -2px rgba(26, 22, 20, 0.03)",
        elevated: "0 12px 32px -4px rgba(26, 22, 20, 0.08), 0 0 0 1px rgba(231, 226, 217, 0.7)",
      },
      letterSpacing: {
        editorial: "0.22em",
        tightest: "-0.03em",
      },
    },
  },
  plugins: [],
};
