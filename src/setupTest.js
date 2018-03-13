import 'raf/polyfill'
import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

configure({adapter: new Adapter()})

// Setup fetch mock
global.fetch = require('jest-fetch-mock')

console.error = error => {
  throw Error(error)
}

console.warn = warn => {
  throw Error(warn)
}
