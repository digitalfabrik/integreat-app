const transformNodeModules = [
  'react-native',
  '@react-native',
  '@react-native-firebase/messaging',
  '@react-native-firebase/app',
  '@react-native-community',
  '@react-navigation',
  'react-navigation-header-buttons',
  'react-native-blob-util',
  'shared',
  'translations',
  '@sentry/react-native',
  'build-configs',
  '@dr.pogodin/react-native-static-server',
  '@gorhom/bottom-sheet',
]
process.env.TZ = 'Europe/Berlin'
export default {
  rootDir: '.',
  roots: ['src'],
  displayName: 'native',
  preset: 'react-native',
  automock: false,
  moduleNameMapper: {
    '\\.svg': '<rootDir>/src/__mocks__/svgrMock.ts',
    uuid: require.resolve('uuid'),
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transform: {
    '^.+\\.jsx?$': ['babel-jest', { rootMode: 'upward' }],
    '^.+\\.tsx?$': ['ts-jest', {}],
  },
  transformIgnorePatterns: [`node_modules/(?!${transformNodeModules.join('|')}/)`],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  moduleDirectories: ['node_modules'],
  maxWorkers: '50%',
  workerIdleMemoryLimit: process.env.CI ? '500MB' : undefined,
}
