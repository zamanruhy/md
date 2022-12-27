module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
        useBuiltIns: 'usage',
        corejs: 3,
        targets: {
          esmodules: true
        }
      }
    ]
    // 'solid'
  ],
  plugins: [
    // '@babel/plugin-transform-runtime',
    // '@babel/plugin-syntax-dynamic-import',
    // '@babel/plugin-proposal-class-properties'
  ]
}
