const main = require('./jest.config.js')

module.exports = {
  ...main,
  roots: [
    '<rootDir>'
  ],
  setupFiles: [],
  setupFilesAfterEnv: ['<rootDir>/e2e/config/jest.e2e.setup-framework.js'],
  testMatch: ['**/e2e/**/*.e2e.[jt]s?(x)'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/src/'
  ]
}
