// @flow

import 'raf/polyfill'
import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import integreatTestCmsBuildConfig from '../build/configs/integreat-test-cms'

configure({ adapter: new Adapter() })

// Setup fetch mock
global.fetch = require('jest-fetch-mock')

// Setup config mock
global.__CONFIG__ = integreatTestCmsBuildConfig

// $FlowFixMe
console.error = error => {
  console.log(error)
}
