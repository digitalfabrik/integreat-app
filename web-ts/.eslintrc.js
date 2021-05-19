module.exports = {
  plugins: ['@typescript-eslint'],
  extends: ['../.eslintrc.js', 'plugin:@typescript-eslint/recommended'],
  rules: {
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error']
    '@typescript-eslint/ban-ts-comment': 'warn'
  }
}
