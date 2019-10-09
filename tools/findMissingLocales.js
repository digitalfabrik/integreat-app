const fs = require('fs')
const task = require('./task')

const { reduce, map, union, isEmpty } = require('lodash')

function findMissingLocales () {
  const locales = JSON.parse(fs.readFileSync('./locales/locales.json', 'utf8'))
  const keys = reduce(locales, (moduleAcc, languages, moduleKey) => {
    const keysPerLanguage = map(languages, values => Object.keys(values))
    moduleAcc[moduleKey] = union(...keysPerLanguage)
    return moduleAcc
  }, {})

  const missingKeys = reduce(locales, (moduleAcc, languages, moduleKey) => {
    const missingKeysInModule = reduce(languages, (languageAcc, languageKeys, languageKey) => {
      const missingKeysInLanguage = keys[moduleKey].filter(key => !languageKeys[key])
      if (!isEmpty(missingKeysInLanguage)) {
        languageAcc[languageKey] = missingKeysInLanguage
      }
      return languageAcc
    }, {})

    if (!isEmpty(missingKeysInModule)) {
      moduleAcc[moduleKey] = missingKeysInModule
    }
    return moduleAcc
  }, {})

  return missingKeys
}

module.exports = task('findMissingLocales', () => {
  return Promise.resolve(findMissingLocales())
    .then(locales => console.log(locales))
})
