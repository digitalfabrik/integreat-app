module.exports = {
  'preset': 'react-native',
  'verbose': true,
  'automock': false, // Always explicitly mock modules
  'setupFiles': [
    '<rootDir>/jest.setup.js'
  ],
  'transformIgnorePatterns': [
    'node_modules/(?!react-native|@react-native-community/async-storage|rn-fetch-blob|@integreat-app/integreat-api-client|antd|rc-.+)'
  ],
  'moduleFileExtensions': [
    'js'
  ],
  'moduleDirectories': [
    'node_modules',
    'src'
  ],
  'globals': {
    '__DEV__': false
  },
  'collectCoverageFrom': [
    '**/*.{js,jsx}'
  ],
  'coverageDirectory': '../__coverage__'
}
