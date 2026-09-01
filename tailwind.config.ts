import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Brand copper-bronze, taken from the ViRaj Rides signboard logo
        brand: {
          DEFAULT: "#C87137",
          light: "#E8A860",
          dark: "#8E4A20",
        },
        ink: {
          DEFAULT: "#08080A",
          soft: "#101013",
          card: "#16161A",
          line: "#26262C",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "serif"],
      },
      boxShadow: {
        brand: "0 0 40px -10px rgba(200,113,55,0.45)",
        "brand-lg": "0 10px 60px -12px rgba(200,113,55,0.5)",
        card: "0 20px 60px -20px rgba(0,0,0,0.7)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translate3d(0,0,0)" },
          "50%": { transform: "translate3d(0,-12px,0)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translate3d(0,24px,0)" },
          "100%": { opacity: "1", transform: "translate3d(0,0,0)" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "sweep": {
          "0%": { transform: "translateX(-120%) skewX(-12deg)" },
          "100%": { transform: "translateX(220%) skewX(-12deg)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "fade-up": "fade-up 0.6s ease-out both",
        "spin-slow": "spin-slow 24s linear infinite",
        sweep: "sweep 3.5s ease-in-out infinite",
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(135deg, #E8A860 0%, #C87137 45%, #8E4A20 100%)",
        "radial-brand":
          "radial-gradient(ellipse at center, rgba(200,113,55,0.20) 0%, rgba(8,8,10,0) 62%)",
      },
    },
  },
  plugins: [],
};
export default config;
