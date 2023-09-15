module.exports = {
  plugins: [require.resolve('@trivago/prettier-plugin-sort-imports')],
  semi: false,
  singleQuote: true,
  arrowParens: 'avoid',
  printWidth: 120,
  bracketSameLine: true,
  jsxSingleQuote: true,
  endOfLine: 'auto',
  importOrder: [
    '^(?!(api-client|build-configs|translations|\\.)).*',
    '^(api-client|build-configs|translations)',
    '^(\\.)+(\\/)+',
  ],
  importOrderSeparation: true,
}
