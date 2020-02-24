const jestPreset = require('@testing-library/react-native/jest-preset')

const transformNodeModules = [
  'react-native',
  '@react-native-community/async-storage',
  '@react-navigation/native/dist', // for integration tests including react-navigation
  'react-navigation-stack', // for integration tests including react-navigation
  'react-navigation-header-buttons', // for integration tests including react-navigation
  'rn-fetch-blob',
  '@integreat-app/integreat-api-client',
  '@sentry/react-native'
]

module.exports = {
  preset: '@testing-library/react-native',
  verbose: true,
  automock: false, /* Always explicitly mock modules. Also automocking seems to be broken right now:
                        https://github.com/facebook/jest/issues/6127 */
  setupFiles: [
    ...jestPreset.setupFiles,
    '<rootDir>/jest.setup.js'
  ],
  setupFilesAfterEnv: ['jest-extended',
    '<rootDir>/jest.setup.afterenv.js'
  ],
  transformIgnorePatterns: [
    `node_modules/(?!${transformNodeModules.join('|')})`
  ],
  moduleFileExtensions: [
    'js'
  ],
  moduleDirectories: [
    'node_modules',
    'src'
  ],
  globals: {
    __DEV__: false
  },
  collectCoverageFrom: [
    '**/*.{js,jsx}'
  ],
  coverageDirectory: '../__coverage__'
}
