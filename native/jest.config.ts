import { defaults as tsjPreset } from 'ts-jest/presets'

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
  },
  setupFilesAfterEnv: [
    '<rootDir>/../jest.setup.ts',
    '<rootDir>/../node_modules/@testing-library/jest-native/extend-expect',
  ],
  transform: tsjPreset.transform,
  transformIgnorePatterns: [`node_modules/(?!${transformNodeModules.join('|')})`],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  modulePaths: ['<rootDir>'],
  moduleDirectories: ['node_modules'],
  maxWorkers: '50%',
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
