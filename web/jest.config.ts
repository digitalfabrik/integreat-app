/** @jest-config-loader ts-node */
import { type JestConfigWithTsJest, createDefaultEsmPreset } from 'ts-jest'

const transformNodeModules = ['shared', 'build-configs', 'translations', 'qr']
process.env.TZ = 'Europe/Berlin'
const config: JestConfigWithTsJest = {
  ...createDefaultEsmPreset(),
  rootDir: '.',
  roots: ['src'],
  displayName: 'web',
  automock: false,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transformIgnorePatterns: [`node_modules/(?!${transformNodeModules.join('|')})`],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/src/__mocks__/fileMock.ts',
    '\\.(css|less)$': '<rootDir>/src/__mocks__/styleMock.ts',
  },
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
  maxWorkers: '50%',
  workerIdleMemoryLimit: process.env.CI ? '500MB' : undefined,
  transform: {
    '^.+\\.(j|t)sx?$': ['ts-jest', {}],
  },
  testEnvironment: 'jsdom',
  globals: {
    __BUILD_CONFIG_NAME__: 'integreat-test-cms',
    // __BUILD_CONFIG__ is set in jest.setup.ts because importing the (ESM-only) build-configs package here would break ts-node.
    __VERSION_NAME__: '0.0.0',
    __COMMIT_SHA__: 123456789,
  },
}

export default config
