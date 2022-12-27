/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./index.html', 'src/**/*.{js,jsx,ts,tsx,html}'],
  darkMode: 'class',
  theme: {
    screens: {
      // last: '360px',
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
      '2xl': '1600px',
      '3xl': '1900px'
    },
    extend: {
      fontFamily: {
        brand: ['Arial', ...defaultTheme.fontFamily.sans],
        display: ['Panton', ...defaultTheme.fontFamily.sans],
        accent: ['Roboto', ...defaultTheme.fontFamily.sans]
      },
      minHeight: defaultTheme.height,
      minWidth: defaultTheme.width
    }
  },
  corePlugins: {
    container: false
  },
  plugins: []
}
