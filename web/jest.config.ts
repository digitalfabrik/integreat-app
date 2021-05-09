const transformNodeModules = ['api-client', 'build-configs', 'translations'];
module.exports = {
  rootDir: 'src',
  verbose: true,
  automock: false,
  setupFilesAfterEnv: ['<rootDir>/../jest.setup.js'],
  transformIgnorePatterns: [`node_modules/(?!${transformNodeModules.join('|')})`],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js',
    '\\.(css)$': 'identity-obj-proxy',
    hashids: 'hashids/dist/hashids.min.js'
  },
  moduleFileExtensions: ['js', 'json'],
  moduleDirectories: ['node_modules'],
  coverageDirectory: '<rootDir>/../reports/coverage',
  reporters: ['default', ['jest-junit', {
    outputDirectory: '<rootDir>/../reports/unit-test'
  }]],
  snapshotSerializers: ['enzyme-to-json/serializer']
};