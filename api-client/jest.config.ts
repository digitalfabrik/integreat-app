export default {
  rootDir: 'src/',
  displayName: 'api-client',
  automock: false,
  setupFiles: ['<rootDir>/../jest.setup.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.(j|t)sx?$': ['ts-jest', { isolatedModules: true }],
  },
  maxWorkers: '50%',
}
