module.exports = {
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/ban-ts-comment': 'warn'
  },
  extends: ['../.eslintrc.js', 'plugin:@typescript-eslint/recommended']
}
