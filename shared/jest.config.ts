export default {
  rootDir: './',
  displayName: 'shared',
  automock: false,
  setupFiles: ['<rootDir>/jest.setup.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testEnvironment: 'node',
  testPathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/'],
  transform: {
    '^.+\\.(j|t)sx?$': ['ts-jest', { isolatedModules: true }],
  },
  maxWorkers: '50%',
}
