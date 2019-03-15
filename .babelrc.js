const useHMR = !!global.HMR // HotModuleReplacement
const config = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-react',
    '@babel/preset-flow'
  ],
  plugins: [
    'babel-plugin-styled-components',
    '@babel/plugin-transform-react-jsx',
    '@babel/plugin-transform-runtime',
    // Partial Stage 1:
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-logical-assignment-operators',
    ['@babel/plugin-proposal-optional-chaining', {'loose': false}],
    ['@babel/plugin-proposal-pipeline-operator', {'proposal': 'minimal'}],
    ['@babel/plugin-proposal-nullish-coalescing-operator', {'loose': false}],
    '@babel/plugin-proposal-do-expressions',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-export-namespace-from',
    'lodash'
  ]
}

if (useHMR) {
  config.babelrc = false
  config.cacheDirectory = useHMR
  config.plugins.unshift('react-hot-loader/babel')
}

module.exports = config
