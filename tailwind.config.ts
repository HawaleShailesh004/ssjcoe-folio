import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: "#ffffff",
      black: "#000000",

      // Warm stone scale — derived from SSJCOE's saffron identity
      stone: {
        950: "#1A1410", // Deep warm dark — hero bg, footer
        900: "#2C2218", // Dark panels
        800: "#3D3530", // Body text
        700: "#5C5248", // Secondary text
        600: "#7A6F65", // Muted text
        500: "#9E948A", // Placeholder
        400: "#BDB5AF", // Borders dark
        300: "#D4CEC9", // Borders light
        200: "#E8E3DE", // Subtle bg borders
        100: "#F2EDE8", // Surface
        50: "#FAF7F2", // Page bg — warm cream
      },

      // Saffron — SSJCOE's identity color
      saffron: {
        DEFAULT: "#E8820C", // Primary accent
        dark: "#C46D08", // Hover state
        light: "#FDF0E0", // Tint background
        muted: "#F4A84A", // Secondary uses
      },

      // Status — warm tones to match palette
      ok: { DEFAULT: "#15622A", bg: "#F0FDF4", border: "#BBF7D0" },
      warn: { DEFAULT: "#8A4B08", bg: "#FFF7ED", border: "#FED7AA" },
      fail: { DEFAULT: "#8B1C1C", bg: "#FFF1F1", border: "#FECACA" },
      idle: { DEFAULT: "#5C5248", bg: "#F2EDE8", border: "#D4CEC9" },
    },

    spacing: {
      px: "1px",
      0: "0",
      1: "4px",
      2: "8px",
      3: "12px",
      4: "16px",
      5: "20px",
      6: "24px",
      7: "28px",
      8: "32px",
      9: "36px",
      10: "40px",
      12: "48px",
      14: "56px",
      16: "64px",
      20: "80px",
      24: "96px",
      28: "112px",
      32: "128px",
      36: "144px",
      40: "160px",
      48: "192px",
    },

    fontSize: {
      "2xs": ["10px", { lineHeight: "14px", letterSpacing: "0.05em" }],
      xs: ["11px", { lineHeight: "16px", letterSpacing: "0.04em" }],
      sm: ["13px", { lineHeight: "20px", letterSpacing: "0.01em" }],
      base: ["15px", { lineHeight: "24px", letterSpacing: "0" }],
      lg: ["18px", { lineHeight: "28px", letterSpacing: "-0.01em" }],
      xl: ["21px", { lineHeight: "30px", letterSpacing: "-0.015em" }],
      "2xl": ["26px", { lineHeight: "34px", letterSpacing: "-0.02em" }],
      "3xl": ["32px", { lineHeight: "40px", letterSpacing: "-0.025em" }],
      "4xl": ["40px", { lineHeight: "48px", letterSpacing: "-0.03em" }],
      "5xl": ["52px", { lineHeight: "58px", letterSpacing: "-0.035em" }],
      "6xl": ["64px", { lineHeight: "70px", letterSpacing: "-0.04em" }],
      "7xl": ["80px", { lineHeight: "86px", letterSpacing: "-0.04em" }],
    },

    fontFamily: {
      display: ["'Cormorant Garamond'", "Georgia", "serif"],
      sans: ["'Outfit'", "system-ui", "sans-serif"],
      mono: ["'JetBrains Mono'", "monospace"],
    },

    fontWeight: {
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },

    borderRadius: {
      none: "0",
      sm: "2px",
      DEFAULT: "4px",
      md: "6px",
      lg: "8px",
      xl: "12px",
      full: "9999px",
    },

    boxShadow: {
      none: "none",
      sm: "0 1px 2px 0 rgb(26 20 16 / 0.06)",
      DEFAULT:
        "0 1px 4px 0 rgb(26 20 16 / 0.08), 0 1px 2px -1px rgb(26 20 16 / 0.04)",
      md: "0 4px 12px -2px rgb(26 20 16 / 0.10), 0 2px 4px -2px rgb(26 20 16 / 0.06)",
      lg: "0 12px 24px -4px rgb(26 20 16 / 0.12), 0 4px 8px -4px rgb(26 20 16 / 0.06)",
      glow: "0 0 0 3px rgb(232 130 12 / 0.15)",
    },

    extend: {
      maxWidth: {
        container: "1200px",
        prose: "66ch",
      },
      backgroundImage: {
        grain:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
      animation: {
        "fade-up":
          "fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) forwards",
        "fade-in": "fadeIn 0.4s ease-out forwards",
        "slide-in":
          "slideIn 0.4s cubic-bezier(0.22,1,0.36,1) forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(-12px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
