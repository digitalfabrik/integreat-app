// Setup fetch mock
global.fetch = require('jest-fetch-mock')

console.error = error => {
  throw Error(error)
}

console.warn = warn => {
  throw Error(warn)
}
