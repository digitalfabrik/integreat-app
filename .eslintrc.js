// @flow

module.exports = {
  parser: 'babel-eslint',
  plugins: [
    'react',
    'react-hooks',
    'flowtype',
    'jest'
  ],
  extends: [
    'standard',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:flowtype/recommended'
  ],
  env: {
    es6: true,
    node: true,
    browser: true,
    'jest/globals': true
  },
  settings: {
    flowtype: {
      onlyFilesWithFlowAnnotation: true
    }
  },
  ignorePatterns: [
    '**/flow-typed/',
    '**/reports/',
    '**/node_modules/',
    '**/ios/main.jsbundle',
    '**/stylelint.config.js',
    '**/dist/',
    '**/lib-dist/'
  ],
  rules: {
    'arrow-parens': ['error', 'as-needed'],
    curly: ['error', 'all'],
    'jsx-quotes': ['error', 'prefer-single'],
    'max-len': ['warn', { code: 120 }],
    'no-loop-func': 'error',
    'prefer-const': 'error',
    'prefer-object-spread': 'error',
    'prefer-template': 'error',

    'react/display-name': 'off',
    'react/no-access-state-in-setstate': 'error',
    'react/no-did-mount-set-state': 'warn',
    'react/no-did-update-set-state': 'warn',
    'react/no-unescaped-entities': 'off',
    'react/no-unused-prop-types': 'warn',
    'react/no-typos': 'error',
    'react/prefer-es6-class': ['error', 'always'],

    'flowtype/delimiter-dangle': ['error', 'never'],
    'flowtype/newline-after-flow-annotation': ['error', 'always'],
    'flowtype/no-primitive-constructor-types': 'error',
    'flowtype/no-weak-types': 'warn',
    'flowtype/object-type-delimiter': ['error', 'comma'],
    'flowtype/require-exact-type': ['warn', 'always'],
    'flowtype/require-parameter-type': ['error', { excludeArrowFunctions: true }],
    'flowtype/require-return-type': ['error', 'always', {
      excludeArrowFunctions: true,
      annotateUndefined: 'never',
      excludeMatching: ['^render$']
    }],
    'flowtype/semi': ['error', 'never'],
    'flowtype/type-id-match': ['error', '^(iOS)?([A-Z][a-z0-9]+)+Type$'],
    'flowtype/valid-syntax': 'warn',

    'jest/consistent-test-it': 'error',
    'jest/no-disabled-tests': 'error',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/no-test-prefixes': 'error',
    'jest/prefer-to-be-null': 'error',
    'jest/prefer-to-have-length': 'error',
    'jest/valid-describe': 'error',
    'jest/valid-expect': 'error'
  },
  overrides: [{
    files: ['**/src/**/*.js'],
    rules: {
      'flowtype/require-valid-file-annotation': ['error', 'always', { annotationStyle: 'line' }]
    }
  }, {
    files: ['*.js'],
    excludedFiles: ['*.spec.js', '**/__mocks__/*.js'],
    rules: {
      'react/jsx-no-bind': ['error', {
        ignoreRefs: false,
        allowArrowFunctions: false,
        allowFunctions: false,
        allowBind: false
      }],
      'no-magic-numbers': ['error', {
        ignore: [-1, 0, 1, 2],
        ignoreArrayIndexes: true
      }]
    }
  }]
}
