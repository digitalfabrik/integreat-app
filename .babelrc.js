const useHMR = !!global.HMR // HotModuleReplacement
const config = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-react',
    '@babel/preset-stage-1',
    '@babel/preset-flow'
  ],
  plugins: [
    'babel-plugin-styled-components',
    '@babel/plugin-transform-react-jsx',
    ['babel-plugin-transform-builtin-extend', {
      globals: ["Error"]
    }]
  ]
}

if (useHMR) {
  config.babelrc = false
  config.cacheDirectory = useHMR
  config.plugins.unshift('react-hot-loader/babel')
}

module.exports = config
