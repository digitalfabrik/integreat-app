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
  rootDir: 'src',
  preset: 'react-native',
  verbose: true,
  automock: false,

  /* Always explicitly mock modules. Also automocking seems to be broken right now:
        https://github.com/facebook/jest/issues/6127 */
  moduleNameMapper: {
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
    '\\.svg': '<rootDir>/__mocks__/svgrMock.ts',
    uuid: require.resolve('uuid'),
  },
  setupFilesAfterEnv: [
    '<rootDir>/../jest.setup.ts',
    '<rootDir>/../node_modules/@testing-library/jest-native/extend-expect',
  ],
  transform: {
    '^.+\\.jsx?$': ['babel-jest', { rootMode: 'upward' }],
    '^.+\\.tsx?$': ['ts-jest', { isolatedModules: true }],
  },
  transformIgnorePatterns: [`node_modules/(?!${transformNodeModules.join('|')}/)`],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  modulePaths: ['<rootDir>'],
  moduleDirectories: ['node_modules'],
  maxWorkers: '50%',
  workerIdleMemoryLimit: process.env.CI ? '500MB' : undefined,
  coverageDirectory: '<rootDir>/../reports/coverage',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: '<rootDir>/../reports/unit-test',
      },
    ],
  ],
}
