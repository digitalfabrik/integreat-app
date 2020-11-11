// @flow

import 'raf/polyfill'
import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import integreatTestCmsBuildConfig from 'build-configs/integreat-test-cms'
import '@testing-library/jest-dom'

configure({ adapter: new Adapter() })

// Setup fetch mock
global.fetch = require('jest-fetch-mock')

// Setup config mock
global.__BUILD_CONFIG__ = integreatTestCmsBuildConfig
