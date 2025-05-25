export default {
  presets: [
    ['@babel/preset-env', {
      targets: {
        node: 'current',
      },
      useBuiltIns: 'usage',
      corejs: 3,
      modules: 'auto',
    }]
  ],
  plugins: [
    ['@babel/plugin-transform-runtime', {
      regenerator: true,
      useESModules: true
    }]
  ]
}
