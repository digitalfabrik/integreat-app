module.exports = {
  rootDir: 'src/',
  verbose: true,
  automock: false,
  setupFiles: [
    '<rootDir>/setupTest.js'
  ],
  transformIgnorePatterns: [
    'node_modules/(?!build-configs|api-client)'
  ],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js',
    '\\.(css)$': 'identity-obj-proxy',
    hashids: 'hashids/dist/hashids.min.js'
  },
  moduleFileExtensions: [
    'js',
    'json'
  ],
  moduleDirectories: [
    'node_modules'
  ],
  collectCoverageFrom: [
    '**/*.{js,jsx}'
  ],
  coverageDirectory: '<rootDir>/../reports/coverage',
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: 'reports/unit-test',
      outputName: 'junit-test.xml'
    }]
  ],
  snapshotSerializers: [
    'enzyme-to-json/serializer'
  ]
}
