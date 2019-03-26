module.exports = {
  'preset': 'react-native',
  'verbose': true,
  'automock': false,
  'setupFiles': [
    '<rootDir>/jest.setup.js'
  ],
  'transform': {
    // https://github.com/facebook/react-native/issues/19859 https://github.com/facebook/react/issues/13182
    '^.+\\.js$': '<rootDir>/node_modules/react-native/jest/preprocessor.js'
  },
  'transformIgnorePatterns': [
    'node_modules/?!(antd|rc-.+)/'
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
