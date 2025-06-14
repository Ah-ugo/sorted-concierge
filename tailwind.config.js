/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "#000000", // Force black
        foreground: "#ffffff", // Force white
        primary: {
          DEFAULT: "#000000", // Pure black
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#d4af37", // Gold
          foreground: "#000000",
          light: "#FAC364", // Added light gold
          dark: "#CC913F", // Added dark gold
        },
        destructive: {
          DEFAULT: "hsl(0 60% 50%)",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#2B2B2B", // Updated to requested very dark gray
          foreground: "#cccccc",
        },
        accent: {
          DEFAULT: "#131313", // Updated to requested darker gray
          foreground: "#ffffff",
        },
        popover: {
          DEFAULT: "#000000",
          foreground: "#ffffff",
        },
        card: {
          DEFAULT: "#2B2B2B", // Updated to requested very dark gray
          foreground: "#ffffff",
        },
        white: "#FFFFFF", // Added pure white as a utility color
      },
      backgroundColor: {
        // "gold-gradient":
        // "linear-gradient(90deg, #FAC364 0%, #d4af37 50%, #CC913F 100%)", // Gold gradient
        "gold-gradient": "#CC913F ",
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.25rem",
      },
      fontFamily: {
        sans: ["var(--font-lato)", "sans-serif"],
        cinzel: ["var(--font-cinzel)", "serif"],
        lora: ["var(--font-lora)", "serif"],
        archivo: ["var(--font-archivo)", "serif"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "fade-in": {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "pulse-gold": {
          "0%": {
            transform: "scale(1)",
            boxShadow: "0 0 0 0 rgba(212, 175, 55, 0.6)",
          },
          "70%": {
            transform: "scale(1.05)",
            boxShadow: "0 0 0 12px rgba(212, 175, 55, 0)",
          },
          "100%": {
            transform: "scale(1)",
            boxShadow: "0 0 0 0 rgba(212, 175, 55, 0)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "pulse-gold": "pulse-gold 2s infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
