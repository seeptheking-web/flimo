import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#7a9e7e",
          50: "#f2f7f2",
          100: "#e5efe6",
          200: "#ccdece",
          300: "#aac9ac",
          400: "#8bb48e",
          500: "#7a9e7e",
          600: "#628267",
          700: "#4e6852",
          800: "#3b4f3d",
          900: "#273529",
        },
      },
    },
  },
  plugins: [],
};

export default config;
