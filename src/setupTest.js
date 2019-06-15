// @flow

import 'raf/polyfill'
import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import integreatAppConfig from '../tools/integreat-config'

configure({adapter: new Adapter()})

// Setup fetch mock
global.fetch = require('jest-fetch-mock')

// Setup config mock
global.__CONFIG__ = integreatAppConfig

// $FlowFixMe
console.error = error => {
  throw Error(error)
}

// $FlowFixMe
console.warn = warn => {
  throw Error(warn)
}
