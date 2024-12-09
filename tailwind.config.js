/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        sm: ['14px', '20px'], // 14px font size with a 20px line height
      },
      screens:{
        sm: '640px',
        md: '768px',
        lg: '1024px',
        custom_lg: '1400px', // added a custom_lg for responsivness (implemented in agreement page add new popup)
      },
      
    },
  },
  plugins: [],
}

