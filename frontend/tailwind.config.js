/** @type {import('tailwindcss').Config} */
export default {
  // This 'content' array is the most critical part. It tells Tailwind
  // which files to scan for class names. This pattern covers all
  // relevant files in your 'src' directory.
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563EB", // A professional blue
          hover: "#1D4ED8",
        },
        secondary: "#475569",
        accent: "#F59E0B",
        neutral: {
          100: "#F3F4F6", // Light gray for backgrounds
          800: "#1F2937", // Dark gray for text
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // A clean, modern font
      },
    },
  },
  plugins: [],
}
