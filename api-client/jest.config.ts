export default {
  displayName: 'api-client',
  roots: ['src'],
  preset: 'ts-jest',
  automock: false,
  setupFiles: ['./jest.setup.ts'],
  moduleDirectories: ['node_modules'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testEnvironment: 'node',
  maxWorkers: '50%'
}
