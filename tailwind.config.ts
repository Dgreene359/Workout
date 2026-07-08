import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17201b",
        paper: "#fbfaf6",
        moss: "#62735a",
        clay: "#b76545",
        teal: "#227c75",
        citron: "#d6e26f"
      },
      boxShadow: {
        soft: "0 18px 60px rgba(23, 32, 27, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
