import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // SYSTEM COLORS
        "acent-color": "#FF7A00",
        "primary-color": "#093269",
        primary: {
          100: "#D5E6FB",
          200: "#ACCCF8",
          500: "#2F80ED",
          800: "#093269",
        },
        "secundary-color": "#ACCCF8",
        // BUTTONS
        "primary-normal": "#093269",
        "primary-pressed": "#EB7100",
        "primary-disable": "#FFCD9F",
        "secundary-normal": "#FFEDDD",
        "secundary-pressed": "#FFE2C7"
      }
    },
    backgroundImage: {
      'login-pattern': "url('/img/fondo_login.png')"
    },
  },
  plugins: [],
};
export default config;
