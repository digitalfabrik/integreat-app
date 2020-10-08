const transformNodeModules = [
  'react-native',
  '@react-native-firebase/messaging',
  '@react-native-firebase/app',
  '@react-native-community/async-storage',
  '@react-navigation/native/dist', // for integration tests including react-navigation
  'react-navigation-stack', // for integration tests including react-navigation
  'react-navigation-header-buttons', // for integration tests including react-navigation
  'rn-fetch-blob',
  '@integreat-app/integreat-api-client',
  '@sentry/react-native',
  'hashids',
  '@react-native-community/progress-bar-android',
  '@react-native-community/progress-view'
]

module.exports = {
  preset: 'react-native',
  verbose: true,
  automock: false, /* Always explicitly mock modules. Also automocking seems to be broken right now:
                        https://github.com/facebook/jest/issues/6127 */
  moduleNameMapper: {
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
    '\\.(css|less)$': 'identity-obj-proxy'
  },
  setupFiles: [
    '<rootDir>/jest.setup.js'
  ],
  setupFilesAfterEnv: [
    'jest-extended',
    '@testing-library/jest-native/extend-expect'
  ],
  transformIgnorePatterns: [
    `node_modules/(?!${transformNodeModules.join('|')})`
  ],
  moduleFileExtensions: [
    'js',
    'json'
  ],
  moduleDirectories: [
    'node_modules',
    'src'
  ],
  collectCoverageFrom: [
    '**/*.{js,jsx}'
  ],
  coverageDirectory: '../__coverage__'
}
