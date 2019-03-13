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
