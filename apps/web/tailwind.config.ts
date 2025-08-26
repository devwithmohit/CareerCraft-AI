// / * * @type {import('tailwindcss').Config} */;
// module.exports = {
//   darkMode: ["class"],
//   content: [
//     "./app/**/*.{js,ts,jsx,tsx}", // agar app directory use ho rahi hai
//     "./pages/**/*.{js,ts,jsx,tsx}", // pages directory
//     "./components/**/*.{js,ts,jsx,tsx}", // components
//   ],

//   theme: {
//     extend: {},
//   },
//   plugins: [require("tailwindcss-animate")],
// };

// "dev": "next dev --turbopack --port 3000",


  // "dev": "next dev --port 3000",

// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   // Enable dark mode using the 'class' strategy
//   darkMode: ['class'],

//   // Paths to all of your template files
//   content: [
//     './app/**/*.{js,ts,jsx,tsx}',       // If you're using the App Router
//     './pages/**/*.{js,ts,jsx,tsx}',     // If you're using the Pages directory
//     './components/**/*.{js,ts,jsx,tsx}' // Any reusable UI components
//   ],

//   theme: {
//     extend: {}, // Extend Tailwind's default theme here
//   },

//   // Add any plugins here
//   plugins: [
//     require('tailwindcss-animate') // For animation utilities
//   ],
// };

import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

const config: Config = {
  // darkMode: ['class'],
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {},
  },
  plugins: [animate],
}

export default config
