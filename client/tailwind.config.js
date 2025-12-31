const colors = require("tailwindcss/colors");

module.exports = {
  mode: "jit",
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
          950: "#022c22",
        },
      },
    },
    fontFamily: {
      body: [
        "Open Sans",
        "ui-sans-serif",
        "system-ui",
        "-apple-system",
        "system-ui",
        "Segoe UI",
        "Roboto",
        "Helvetica Neue",
        "Arial",
        "Noto Sans",
        "sans-serif",
        "Apple Color Emoji",
        "Segoe UI Emoji",
        "Segoe UI Symbol",
        "Noto Color Emoji",
      ],
      sans: [
        "Open Sans",
        "ui-sans-serif",
        "system-ui",
        "-apple-system",
        "system-ui",
        "Segoe UI",
        "Roboto",
        "Helvetica Neue",
        "Arial",
        "Noto Sans",
        "sans-serif",
        "Apple Color Emoji",
        "Segoe UI Emoji",
        "Segoe UI Symbol",
        "Noto Color Emoji",
      ],
    },
  },
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    // Add your paths
  ],
  theme: {
    extend: {
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        animationUpDown: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        marquee: "marquee 20s linear infinite",
        "up-down": "animationUpDown 2s linear infinite",
      },
    },
  },
  theme: {
    extend: {},
    screens: {
      xs: "480px", // Custom extra-small
      sm: "640px", // Small
      md: "768px", // Medium (Tablet)
      ml: "850px", // Custom: Mid-Large
      lg: "1024px", // Large (Laptop)
      xl: "1280px", // Extra Large
      "2xl": "1536px", // 2X Large
    },
  },
  plugins: [ require('@tailwindcss/typography'),],
  theme: {
    extend: {
      animation: {
        marquee: "marquee 25s linear infinite",
        marquee2: "marquee2 25s linear infinite",
      },
         animation: {
        'border-spin': 'borderSpin 6s linear infinite',
         ping: 'ping 4s cubic-bezier(0, 0, 0.2, 1) infinite',
         
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        marquee2: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0%)" },
        },
         borderSpin: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
        transitionDuration: {
        3000: '3000ms',
      },
      },
    },
   
 
  },
  variants: {},
};
