import { heroui } from "@heroui/theme"

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        gilroy: ['Gilroy', 'sans-serif'],
      },
      textShadow: {
        sm: '1px 1px 2px rgba(0, 0, 0, 0.25)',
        DEFAULT: '2px 2px 4px rgba(0, 0, 0, 0.3)',
        lg: '3px 3px 6px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  darkMode: "class",
  plugins: [heroui(), function ({ addUtilities, theme }) {
    const shadows = theme('textShadow')
    const newUtilities = Object.entries(shadows).map(([key, value]) => {
      return {
        [`.text-shadow${key === 'DEFAULT' ? '' : `-${key}`}`]: {
          textShadow: value,
        },
      }
    })
    addUtilities(newUtilities)
  },],
}
