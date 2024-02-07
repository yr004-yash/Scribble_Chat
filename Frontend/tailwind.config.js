/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        navy: '#001F3F', // You can adjust the hex code to match the exact shade you want
      },
      textOverflow: ['hover', 'focus'],
    },
    spacing: {
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '48px',
     }
  },
  plugins: [],
}

