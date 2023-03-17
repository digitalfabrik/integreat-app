export default {
  displayName: 'translations',
  roots: ['src'],
  preset: 'ts-jest',
  automock: false,
  setupFiles: ['./jest.setup.ts'],
  moduleDirectories: ['node_modules'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  maxWorkers: '50%',
}
