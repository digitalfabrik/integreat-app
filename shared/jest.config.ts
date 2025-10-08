export default {
  rootDir: './',
  displayName: 'shared',
  automock: false,
  setupFiles: ['<rootDir>/jest.setup.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/'],
  transform: {
    '^.+\\.(j|t)sx?$': ['ts-jest', {}],
  },
  maxWorkers: '50%',
}
