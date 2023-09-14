export default {
  rootDir: 'src/',
  displayName: 'api-client',
  preset: 'ts-jest',
  automock: false,
  setupFiles: ['<rootDir>/../jest.setup.ts'],
  moduleDirectories: ['node_modules'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.(j|t)sx?$': [
      'ts-jest',
      {
        isolatedModules: true,
      },
    ],
  },
  maxWorkers: '50%',
}
