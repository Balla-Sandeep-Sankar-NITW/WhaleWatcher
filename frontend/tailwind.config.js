/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        abyss: {
          950: "#04060a",
          900: "#080b12",
          850: "#0b0f19",
          800: "#0f1420",
          700: "#151b2a",
          600: "#1e263a",
          500: "#2a3450",
        },
        ink: {
          300: "#c3cbdb",
          400: "#8b95ac",
          500: "#697089",
          600: "#4d5468",
        },
        signal: {
          teal: "#2dd6c4",
          tealSoft: "#7ce8db",
        },
        gold: {
          glow: "#f0b429",
          soft: "#ffd873",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem", letterSpacing: "0.04em" }],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(45, 214, 196, 0.12), 0 12px 32px -12px rgba(0,0,0,0.65)",
        "glow-lg":
          "0 0 0 1px rgba(45, 214, 196, 0.14), 0 24px 60px -18px rgba(0,0,0,0.75)",
        "glow-gold":
          "0 0 0 1px rgba(240, 180, 41, 0.28), 0 16px 40px -14px rgba(240, 180, 41, 0.18)",
        "inset-line": "inset 0 1px 0 0 rgba(255,255,255,0.04)",
      },
      backgroundImage: {
        "depth-grid":
          "repeating-linear-gradient(180deg, rgba(45,214,196,0.05) 0px, rgba(45,214,196,0.05) 1px, transparent 1px, transparent 96px)",
      },
      animation: {
        sonar: "sonar 2.8s ease-out infinite",
        "pulse-slow": "pulse 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 3s ease-in-out infinite",
        "slide-in": "slide-in 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in": "fade-in 0.5s ease-out",
        "fade-up": "fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        shimmer: "shimmer 1.8s ease-in-out infinite",
        marquee: "marquee 32s linear infinite",
        "flash-teal": "flash-teal 0.7s ease-out",
        "flash-gold": "flash-gold 1.1s ease-out",
      },
      keyframes: {
        sonar: {
          "0%": { transform: "scale(0.6)", opacity: "0.7" },
          "100%": { transform: "scale(2.6)", opacity: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "slide-in": {
          "0%": { transform: "translateX(20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "flash-teal": {
          "0%": { backgroundColor: "rgba(45, 214, 196, 0.16)" },
          "100%": { backgroundColor: "rgba(45, 214, 196, 0)" },
        },
        "flash-gold": {
          "0%": { backgroundColor: "rgba(240, 180, 41, 0.22)" },
          "100%": { backgroundColor: "rgba(240, 180, 41, 0)" },
        },
      },
    },
  },
  plugins: [],
};
