import { Config } from '@jest/types'
import { webIntegreatTestCmsBuildConfig } from 'build-configs/integreat-test-cms'

const transformNodeModules = ['api-client', 'build-configs', 'translations']
const config: Config.InitialOptions = {
  rootDir: 'src',
  preset: 'ts-jest',
  verbose: true,
  automock: false,
  setupFilesAfterEnv: [
    '<rootDir>/../jest.setup.ts',
    '<rootDir>/../node_modules/@testing-library/jest-dom/extend-expect'
  ],
  transformIgnorePatterns: [`node_modules/(?!${transformNodeModules.join('|')})`],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.ts',
    '\\.(css)$': 'identity-obj-proxy',
    hashids: 'hashids/dist/hashids.min.js'
  },
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
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
  ],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  globals: {
    __BUILD_CONFIG__: webIntegreatTestCmsBuildConfig
  }
}

export default config
