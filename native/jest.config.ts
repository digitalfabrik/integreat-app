const transformNodeModules = [
  'react-native',
  '@react-native',
  '@react-native-firebase/messaging',
  '@react-native-firebase/app',
  '@react-native-community',
  '@react-navigation',
  'react-navigation-header-buttons',
  'react-native-blob-util',
  'api-client',
  'translations',
  '@sentry/react-native',
  'build-configs',
  '@dr.pogodin/react-native-static-server',
]
export default {
  displayName: 'native',
  roots: ['src'],
  preset: 'react-native',
  automock: false,

  /* Always explicitly mock modules. Also automocking seems to be broken right now:
        https://github.com/facebook/jest/issues/6127 */
  moduleNameMapper: {
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
    '\\.svg': '<rootDir>/src/__mocks__/svgrMock.ts',
  },
  setupFilesAfterEnv: ['./jest.setup.ts', './node_modules/@testing-library/jest-native/extend-expect'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': 'ts-jest',
  },
  transformIgnorePatterns: [`node_modules/(?!${transformNodeModules.join('|')}/)`],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  modulePaths: ['./src'],
  moduleDirectories: ['node_modules'],
  maxWorkers: '50%',
}
