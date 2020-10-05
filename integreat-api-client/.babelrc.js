const config = {
  presets: [
    [
      "@babel/preset-env",
      {
        "modules": false,
        "targets": {
          "chrome": "42",
          "ie": "11"
        }
      }
    ],
    '@babel/preset-flow'
  ],
  plugins: [
    // Partial Stage 1:
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-logical-assignment-operators',
    '@babel/plugin-transform-runtime',
    ['@babel/plugin-proposal-optional-chaining', {'loose': false}],
    ['@babel/plugin-proposal-pipeline-operator', {'proposal': 'minimal'}],
    ['@babel/plugin-proposal-nullish-coalescing-operator', {'loose': false}],
    '@babel/plugin-proposal-do-expressions',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-export-namespace-from'
  ],
  "env": {
    "test": {
      presets: [
        [
          "@babel/preset-env",
          {
            "modules": 'commonjs',
          }
        ],
        '@babel/preset-flow'
      ],
    }
  }
}

module.exports = config
