// @flow

import 'regenerator-runtime/runtime'

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
