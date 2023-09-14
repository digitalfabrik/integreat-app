export default {
  rootDir: 'src/',
  displayName: 'translations',
  automock: false,
  setupFiles: ['<rootDir>/../jest.setup.ts'],
  moduleDirectories: ['node_modules'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  maxWorkers: '50%',
  transform: {
    '^.+\\.(j|t)sx?$': [
      'ts-jest',
      {
        isolatedModules: true,
      },
    ],
  },
}
