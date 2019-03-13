// @flow

import 'raf/polyfill'
import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
window.regeneratorRuntime = require('regenerator-runtime') // todo remove

configure({adapter: new Adapter()})

// Setup fetch mock
global.fetch = require('jest-fetch-mock')

// $FlowFixMe
console.error = error => {
  throw Error(error)
}

// $FlowFixMe
console.warn = warn => {
  throw Error(warn)
}
