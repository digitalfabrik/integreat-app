import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock'
import fs from 'fs'
import path from 'path'
import { ReactNode } from 'react'

import { I18nManager } from './src/testing/I18nManagerMock'

console.error = () => undefined

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage)
jest.mock('react-native-permissions', () => require('react-native-permissions/mock'))

// react-navigation jest setup
// https://reactnavigation.org/docs/testing#mocking-native-modules
require('react-native-gesture-handler/jestSetup')

jest.mock('react-native-tts')

jest.mock('@sentry/react-native', () => ({
  init: jest.fn(),
  captureException: jest.fn(),
  addBreadcrumb: jest.fn(),
}))

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock')

  Reanimated.default.call = () => undefined

  return Reanimated
})

const walkDir = (dir: string, callback: (filePath: string) => void): void => {
  fs.readdirSync(dir).forEach(f => {
    const filePath = path.join(dir, f)
    const isDirectory = fs.statSync(filePath).isDirectory()
    if (isDirectory) {
      walkDir(filePath, callback)
    } else {
      callback(filePath)
    }
  })
}

// The following code automatically unmocks the modules in `mocksPath`. This is required because jest mocks all these
// modules automatically as soon as they are found
const rootPath = `${__dirname}/src`
const mocksPath = `${rootPath}/__mocks__/`
const mockPathEndings = ['.ts', '.tsx'] // This only unmocks .ts and .tsx files not .json for example
walkDir(mocksPath, name => {
  mockPathEndings.forEach(ending => {
    if (name.endsWith(ending)) {
      jest.unmock(name.substring(mocksPath.length, name.length - ending.length))
    }
  })
})
jest.doMock('react-native/Libraries/ReactNative/I18nManager', () => I18nManager)
jest.doMock(`${rootPath}/constants/NativeConstants`)
jest.doMock('build-config-name')
jest.doMock(`${rootPath}/constants/buildConfig`)
jest.doMock('react-native-blob-util')
jest.doMock('path', () => path.posix)

// See https://github.com/callstack/react-native-testing-library/issues/329#issuecomment-737307473
jest.mock('react-native/Libraries/Components/Switch/Switch', () => {
  const mockComponent = require('react-native/jest/mockComponent')

  return mockComponent('react-native/Libraries/Components/Switch/Switch')
})

// @ts-expect-error https://github.com/software-mansion/react-native-reanimated/issues/1380#issuecomment-865143328
global.__reanimatedWorkletInit = jest.fn()

jest.mock('react-native-keyboard-aware-scroll-view', () => ({
  KeyboardAwareScrollView: ({ children }: { children: ReactNode }) => children,
}))
