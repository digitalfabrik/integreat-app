export default {
  rootDir: '.',
  verbose: true,
  automock: false,
  setupFiles: [],
  setupFilesAfterEnv: ['<rootDir>/e2e/config/jest.e2e.setup-framework.ts'],
  testMatch: ['**/e2e/**/*.e2e.[jt]s?(x)'],
  testPathIgnorePatterns: ['/node_modules/', '/src/']
}
