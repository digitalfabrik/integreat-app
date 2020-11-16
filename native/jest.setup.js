import { JSDOM } from 'jsdom' // jsdom is included in jest and therefore shouldn't be added as dev dependency

const fs = require('fs')
const path = require('path')
require('react-native-gesture-handler/jestSetup')

// window isn't defined as of react-native 0.45+ it seems
if (typeof window !== 'object') {
  global.window = global
  global.window.navigator = {}
}

// Setup fetch mock
global.fetch = require('jest-fetch-mock')
jest.mock('rn-fetch-blob')

// We polyfill FormData here because react-native uses 'node' as 'testEnvironment' option in jest:
// https://jestjs.io/docs/en/configuration#testenvironment-string
// Importing it from jsdom allows us to import stuff selectively
const jsdom = new JSDOM()
const { FormData } = jsdom.window
global.FormData = FormData

function walkDir (dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const filePath = path.join(dir, f)
    const isDirectory = fs.statSync(filePath).isDirectory()
    isDirectory ? walkDir(filePath, callback) : callback(filePath)
  })
}

// The following code automatically unmocks the modules in `mocksPath`. This is required because jest mocks all these
// modules automatically as soon as they are found
const mocksPath = 'src/__mocks__/'
const jsPath = '.js'
walkDir(mocksPath, name => {
  if (name.endsWith(jsPath)) {
    jest.unmock(name.substring(mocksPath.length, name.length - jsPath.length))
  }
})

jest.doMock('react-native/Libraries/ReactNative/I18nManager',
  () => require('testing/I18nManagerMock.js')
)

jest.doMock('modules/app/constants/buildConfig')
