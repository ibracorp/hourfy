import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(222 47% 6%)",
        foreground: "hsl(210 40% 98%)",
        card: "hsl(222 47% 9%)",
        "card-foreground": "hsl(210 40% 98%)",
        border: "hsl(217 33% 18%)",
        input: "hsl(217 33% 18%)",
        primary: "hsl(212 100% 67%)",
        "primary-foreground": "hsl(222 47% 8%)",
        muted: "hsl(217 33% 17%)",
        "muted-foreground": "hsl(215 20% 65%)",
        accent: "hsl(265 92% 76%)",
        "accent-foreground": "hsl(222 47% 8%)"
      },
      boxShadow: {
        glow: "0 0 25px rgba(96, 165, 250, 0.2)"
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" }
        }
      },
      animation: {
        "fade-in": "fade-in 0.6s ease-out",
        "pulse-soft": "pulse-soft 3s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
