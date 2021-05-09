const transformNodeModules = [
  'react-native',
  '@react-native-firebase/messaging',
  '@react-native-firebase/app',
  '@react-native-community',
  '@react-navigation',
  'react-navigation-header-buttons',
  'rn-fetch-blob',
  'api-client',
  'translations',
  '@sentry/react-native',
  'hashids',
  'build-configs'
]
module.exports = {
  rootDir: 'src',
  preset: 'react-native',
  verbose: true,
  automock: false,

  /* Always explicitly mock modules. Also automocking seems to be broken right now:
        https://github.com/facebook/jest/issues/6127 */
  moduleNameMapper: {
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
    '\\.(css|less)$': 'identity-obj-proxy'
  },
  setupFiles: ['<rootDir>/../jest.setup.js'],
  setupFilesAfterEnv: ['jest-extended', '@testing-library/jest-native/extend-expect'],
  transformIgnorePatterns: [`node_modules/(?!${transformNodeModules.join('|')})`],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  modulePaths: ['<rootDir>'],
  moduleDirectories: ['node_modules'],
  coverageDirectory: '<rootDir>/../reports/coverage',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: '<rootDir>/../reports/unit-test'
      }
    ]
  ]
}
