/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        neu: {
          base: "#E8EDF5",
          surface: "#E8EDF5",
          surfaceLight: "#F2F6FB",
          surfaceDark: "#DCE3EE",
          dark: "#1A202C",
          text: {
            main: "#2D3748",
            sub: "#64748B",
            muted: "#94A3B8",
            dark: "#1E293B",
          },
          accent: {
            DEFAULT: "#0EA5E9",
            hover: "#0284C7",
            light: "#E0F2FE",
          },
          primary: {
            DEFAULT: "#3B82F6",
            hover: "#2563EB",
            light: "#EFF6FF",
          },
          success: {
            DEFAULT: "#10B981",
            hover: "#059669",
            light: "#ECFDF5",
          },
          warning: {
            DEFAULT: "#F59E0B",
            hover: "#D97706",
            light: "#FFFBEB",
          },
          danger: {
            DEFAULT: "#EF4444",
            hover: "#DC2626",
            light: "#FEF2F2",
          },
          violet: {
            DEFAULT: "#8B5CF6",
            hover: "#7C3AED",
            light: "#F5F3FF",
          },
        },
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "Space Mono", "monospace"],
        display: ["Plus Jakarta Sans", "Outfit", "sans-serif"],
      },
      boxShadow: {
        "neu-raised": "8px 8px 18px rgba(166, 180, 200, 0.7), -8px -8px 18px rgba(255, 255, 255, 0.95)",
        "neu-raised-sm": "4px 4px 10px rgba(166, 180, 200, 0.65), -4px -4px 10px rgba(255, 255, 255, 0.95)",
        "neu-raised-xs": "2px 2px 6px rgba(166, 180, 200, 0.6), -2px -2px 6px rgba(255, 255, 255, 0.95)",
        "neu-raised-lg": "12px 12px 28px rgba(166, 180, 200, 0.75), -12px -12px 28px rgba(255, 255, 255, 0.95)",
        "neu-inset": "inset 4px 4px 8px rgba(166, 180, 200, 0.65), inset -4px -4px 8px rgba(255, 255, 255, 0.95)",
        "neu-inset-sm": "inset 2px 2px 5px rgba(166, 180, 200, 0.6), inset -2px -2px 5px rgba(255, 255, 255, 0.95)",
        "neu-inset-deep": "inset 6px 6px 12px rgba(166, 180, 200, 0.75), inset -6px -6px 12px rgba(255, 255, 255, 0.95)",
        "neu-pressed": "inset 3px 3px 6px rgba(166, 180, 200, 0.7), inset -3px -3px 6px rgba(255, 255, 255, 0.9)",
        "neu-glow-accent": "0 0 16px rgba(14, 165, 233, 0.5), 4px 4px 10px rgba(166, 180, 200, 0.5), -4px -4px 10px rgba(255, 255, 255, 0.9)",
        "neu-glow-success": "0 0 16px rgba(16, 185, 129, 0.5), 4px 4px 10px rgba(166, 180, 200, 0.5), -4px -4px 10px rgba(255, 255, 255, 0.9)",
      },
      borderRadius: {
        "2xl": "1.25rem",
        "3xl": "1.75rem",
        "4xl": "2.25rem",
        "5xl": "3rem",
      },
    },
  },
  plugins: [],
};
