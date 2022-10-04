import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'
import * as fs from 'fs'
import * as path from 'path'
import 'raf/polyfill'

// Setup fetch mock
global.fetch = require('jest-fetch-mock')
// Setup config mock

const walkDir = (dir: string, callback: (dir: string) => void) => {
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
const mocksPath = 'src/__mocks__/'
const mockPathEndings = ['.ts', '.tsx'] // This only unmocks .ts and .tsx files not .json for example
walkDir(mocksPath, name => {
  mockPathEndings.forEach(ending => {
    if (name.endsWith(ending)) {
      jest.unmock(name.substring(mocksPath.length, name.length - ending.length))
    }
  })
})

Object.defineProperty(window, 'scrollTo', { value: () => undefined, writable: true })
// Needed For BottomActionSheet
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

Object.defineProperty(URL, 'createObjectURL', {
  writable: true,
  value: jest.fn(),
})

// eslint-disable-next-line @typescript-eslint/no-empty-function -- scrollTo doesn't exist in JSDOM
Element.prototype.scrollTo = () => {}
