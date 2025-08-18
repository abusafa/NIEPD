import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: { 
        sm: "640px", 
        md: "768px", 
        lg: "1024px", 
        xl: "1280px", 
        "2xl": "1440px" 
      }
    },
    extend: {
      colors: {
        primary: {
          50: "#E6F7F8",
          100: "#CCEFF1",
          200: "#99DFE3",
          300: "#66CFD5",
          400: "#33BFC7",
          500: "#00AFB9",
          600: "#00808A",
          700: "#006065",
          800: "#004043",
          900: "#002022"
        },
        secondary: {
          50: "#E6EBF5",
          100: "#CCD7EB",
          200: "#99AFD7",
          300: "#6687C3",
          400: "#335FAF",
          500: "#00377B",
          600: "#00234E",
          700: "#001B3E",
          800: "#00122E",
          900: "#000A1F"
        },
        accent: {
          orange: {
            50: "#FDF6E8",
            100: "#FBECD1",
            200: "#F7D9A3",
            300: "#F3C675",
            400: "#EFB347",
            500: "#D6A347",
            600: "#AB8239",
            700: "#80622B",
            800: "#55411C",
            900: "#2A210E"
          },
          green: {
            50: "#E8F5F0",
            100: "#D1EBE1",
            200: "#A3D7C3",
            300: "#75C3A5",
            400: "#47AF87",
            500: "#2C8462",
            600: "#236A4E",
            700: "#1A4F3B",
            800: "#113527",
            900: "#081A14"
          },
          purple: {
            50: "#EDE8F3",
            100: "#DBD1E7",
            200: "#B7A3CF",
            300: "#9375B7",
            400: "#6F479F",
            500: "#3A1F6F",
            600: "#2E1959",
            700: "#231343",
            800: "#170C2C",
            900: "#0C0616"
          }
        },
        neutral: {
          50: "#FAFAFA",
          100: "#F5F5F5",
          200: "#EEEEEE",
          300: "#E0E0E0",
          400: "#BDBDBD",
          500: "#9E9E9E",
          600: "#757575",
          700: "#616161",
          800: "#424242",
          900: "#212121"
        },
        brand: {
          DEFAULT: "#00808A",
          navy: "#00234E",
          bg: "#FFFFFF",
          ink: "#00234E"
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        arabic: ['ReadexPro', 'LamaSans', 'Rubik', 'Tajawal', 'Cairo', 'Noto Kufi Arabic', 'ui-sans-serif', 'system-ui', '-apple-system', '"Segoe UI"', '"Helvetica Neue"', 'Arial', '"Noto Sans"'],
        sans: ['ReadexPro', 'Rubik', 'Inter', 'ui-sans-serif', 'system-ui', '-apple-system', '"Segoe UI"', '"Helvetica Neue"', 'Arial', '"Noto Sans"'],
        brand: ['ReadexPro', 'LamaSans', 'Rubik'],
        readex: ['ReadexPro', 'ui-sans-serif', 'system-ui']
      },
      borderRadius: { 
        sm: "6px", 
        md: "10px", 
        lg: "14px", 
        xl: "20px", 
        "2xl": "28px" 
      },
      boxShadow: {
        sm: "0 1px 2px rgb(0 0 0 / 0.06)",
        md: "0 4px 12px rgb(0 0 0 / 0.08)",
        lg: "0 10px 24px rgb(0 0 0 / 0.10)"
      }
    },
  },
  plugins: [],
};
export default config;
