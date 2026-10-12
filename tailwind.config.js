/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: '#0A2540',
          blue: '#1E40AF',
          amber: '#D97706',
          green: '#059669',
          red: '#DC2626'
        }
      }
    },
  },
  plugins: [],
}