const useRem = false

const breakpoints = {
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
  '2xl': '1600px',
  '3xl': '1900px'
}

module.exports = {
  plugins: [
    require('postcss-import'),
    require('postcss-url')({ url: 'rebase' }),
    require('postcss-mixins')({
      mixins: {
        above(_, min) {
          min = parseFloat(breakpoints[min] || min)
          return {
            [`@media (min-width: ${min}px)`]: {
              '@mixin-content': {}
            }
          }
        },
        below(_, max) {
          max = parseFloat(breakpoints[max] || max)
          return {
            [`@media (max-width: ${max - 1}px)`]: {
              '@mixin-content': {}
            }
          }
        }
      }
    }),
    require('postcss-simple-vars'),
    require('tailwindcss/nesting'),
    require('tailwindcss'),
    useRem
      ? require('postcss-pxtorem')({
          propList: ['*'],
          selectorBlackList: [/^html$/]
        })
      : require('postcss-rem-to-pixel')({ propList: ['*'] }),
    require('autoprefixer')
  ]
}
