import '@testing-library/jest-dom'
import '@testing-library/jest-dom/jest-globals'
import * as fs from 'fs'
import { TextEncoder } from 'node:util'
import * as path from 'path'
import 'raf/polyfill'

window.ResizeObserver = jest.fn().mockImplementation(() => ({
  disconnect: jest.fn(),
  observe: jest.fn(),
  unobserve: jest.fn(),
}))

global.fetch = require('jest-fetch-mock')

console.error = () => undefined

// structuredClone is still not available in JSDOM, so we hack around it... https://github.com/jsdom/jsdom/issues/3363
global.structuredClone = <T>(it: T): T => JSON.parse(JSON.stringify(it))

Element.prototype.scrollIntoView = jest.fn()

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
const mocksPath = path.join(__dirname, '/src/__mocks__/')
const mockPathEndings = ['.ts', '.tsx'] // This only unmocks .ts and .tsx files not .json for example
walkDir(mocksPath, name => {
  mockPathEndings.forEach(ending => {
    if (name.endsWith(ending)) {
      jest.unmock(name.substring(mocksPath.length, name.length - ending.length))
    }
  })
})

Object.defineProperty(window, 'scrollTo', {
  value: () => undefined,
  writable: true,
})
window.crypto.randomUUID = () => '7e21fd52-c6fa-4f76-96d6-045460f4054c'
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

Element.prototype.scroll = () => undefined
Element.prototype.scrollTo = () => undefined

// https://github.com/remix-run/react-router/issues/12363
// @ts-expect-error mistype
globalThis.TextEncoder = TextEncoder
