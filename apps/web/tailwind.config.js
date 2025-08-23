/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",        // agar app directory use ho rahi hai
    "./pages/**/*.{js,ts,jsx,tsx}",      // pages directory
    "./components/**/*.{js,ts,jsx,tsx}", // components
  ],
  
  theme: {
    extend: {},
  },
  plugins: [require("tailwindcss-animate")],
};

  // "dev": "next dev --turbopack --port 3000",
