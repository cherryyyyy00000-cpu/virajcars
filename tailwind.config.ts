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
        // Luxury palette
        gold: {
          DEFAULT: "#C9A24B",
          light: "#E7C877",
          dark: "#8C6D2E",
        },
        ink: {
          DEFAULT: "#0A0A0B",
          soft: "#121214",
          card: "#161619",
          line: "#26262B",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "serif"],
      },
      boxShadow: {
        gold: "0 0 40px -10px rgba(201,162,75,0.45)",
        "gold-lg": "0 10px 60px -12px rgba(201,162,75,0.5)",
        card: "0 20px 60px -20px rgba(0,0,0,0.7)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
        "fade-up": "fade-up 0.7s ease-out both",
        "spin-slow": "spin-slow 22s linear infinite",
      },
      backgroundImage: {
        "gold-gradient":
          "linear-gradient(135deg, #E7C877 0%, #C9A24B 40%, #8C6D2E 100%)",
        "radial-gold":
          "radial-gradient(ellipse at center, rgba(201,162,75,0.18) 0%, rgba(10,10,11,0) 60%)",
      },
    },
  },
  plugins: [],
};
export default config;
