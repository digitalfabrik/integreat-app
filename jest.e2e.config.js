const main = require('./jest.config.js')

module.exports = {
  ...main,
  setupFiles: [],
  setupTestFrameworkScriptFile: '<rootDir>/jest.e2e.setup-framework.js',
  testMatch: ['**/e2e/**/*.e2e.[jt]s?(x)'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/src/'
  ]
}
