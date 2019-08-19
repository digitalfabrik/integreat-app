// setup file
import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter() })

// Setup fetch mock
global.fetch = require('jest-fetch-mock')

console.error = error => {
  throw Error(error)
}

console.warn = warn => {
  throw Error(warn)
}

// window isn't defined as of react-native 0.45+ it seems
if (typeof window !== 'object') {
  global.window = global
  global.window.navigator = {}
}

jest.mock('@react-native-community/async-storage', () => require('@react-native-community/async-storage/jest/async-storage-mock'))
