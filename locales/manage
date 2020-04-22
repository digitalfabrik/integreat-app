#!/usr/bin/node

const program = require('commander')
const fs = require('fs')
const path = require('path')
const flat = require('flat')
const {unflatten} = flat
const stringify = require('csv-stringify')
const parse = require('csv-parse/lib/sync')

const {isEmpty, without, isString, merge, fromPairs, toPairs, zip, sortBy, mapValues} = require('lodash')

program
  .version('0.1.0')
  .option('-d, --debug', 'enable extreme logging')
  .option('-c, --config <config_file>', 'set configuration for managing translations', 'config.json')

const mapStringValuesDeep = (obj, fn) =>
  mapValues(obj, (val, key) =>
    !isString(val)
      ? mapStringValuesDeep(val, fn)
      : fn(val, key, obj)
  )

const flattenModules = (modules) => {
  return flat(modules)
}

const writePairs = (toPath, sourceLanguagePairs, pairs, name) => {
  const output = fs.createWriteStream(`${toPath}/${name}.csv`)

  output.on('close', () => {
    console.log(`Successfully written ${name}.csv.`)
  })

  output.on('error', () => {
    console.log(`Failed to write ${name}.csv.`)
  })

  const withSourceLanguagePairs = zip(sourceLanguagePairs, pairs)
    .map(([[sourceKey, sourceTranslation], [key, translation]]) => [key, sourceTranslation, translation])

  stringify(
    [
      ['key', 'source_language', 'target_language'],
      ...withSourceLanguagePairs
    ]
  ).pipe(output)
}

const EMPTY_MODULE = {}

/**
 * Create a a translation skeleton which has all keys set to an empty string
 *
 * @param language The language which serves as the skeleton
 * @param moduleArray The array of modules (containing all languages) with its keys
 * @returns {*}
 */
const createSkeleton = (language, moduleArray) => {
  return getModulesByLanguage(moduleArray, language)
    .map(([moduleKey, module]) => {

      if (module === EMPTY_MODULE) {
        throw new Error(`Module ${moduleKey} is missing in source language!`)
      }

      return [
        moduleKey,
        mapStringValuesDeep(module, translation => '')
      ]
    })
}

const getModulesByLanguage = (keyModuleArray, language) => {
  return keyModuleArray.map(([moduleKey, module]) => [moduleKey, (module[language] || EMPTY_MODULE)])
}

const mergeByLanguageModule = (byLanguageModule, skeleton, sourceLanguage) => {
  return zip(skeleton, byLanguageModule)
    .map(([[skModuleKey, skModule], [moduleKey, module]]) => {

      const diff = without(Object.keys(flat(module)), ...Object.keys(flat(skModule)))
      if (!isEmpty(diff)) {
        throw new Error(`The keys [${diff}] are missing in module ${moduleKey} 
                        (with the  source language ${sourceLanguage})!`)
      }

      return ([moduleKey, merge({}, skModule, module)])
    })
}

const writeCsvFromJson = (json, toPath, sourceLanguage, targetLanguages) => {
  const moduleArray = sortBy(toPairs(json), ([moduleKey, module]) => moduleKey) // Sort by module key
  const byLanguageModuleArray = fromPairs(
    targetLanguages.map(targetLanguage => [targetLanguage, getModulesByLanguage(moduleArray, targetLanguage)])
  )

  const skeleton = createSkeleton(sourceLanguage, moduleArray)

  const filledByLanguageModuleArray = mapValues(
    byLanguageModuleArray,
    (byLanguageModule) => {
      return mergeByLanguageModule(byLanguageModule, skeleton, sourceLanguage)
    }
  )

  const flattenByLanguage = mapValues(
    filledByLanguageModuleArray,
    (modules) => flattenModules(fromPairs(modules))
  )

  const flattenSourceLanguage = flattenModules(fromPairs(getModulesByLanguage(moduleArray, sourceLanguage)))

  Object.entries(flattenByLanguage)
    .forEach(([languageKey, modules]) =>
      writePairs(toPath, toPairs(flattenSourceLanguage), toPairs(modules), languageKey))

  console.log(`Keys in source language ${sourceLanguage}: ${Object.keys(flattenSourceLanguage).length}`)
}

const loadModules = (csvFile, csvColumn) => {
  const inputString = fs.readFileSync(csvFile, {encoding: 'utf8'}).trim() // .trim() is needed to strip the BOM
  const records = parse(inputString, {
    columns: true,
    skip_empty_lines: true
  })

  const flattened = fromPairs(records.map(record => [record['key'], record[csvColumn]]))

  return unflatten(flattened)
}

const writeJsonFromCsv = (locales, toPath, sourceLanguage) => {
  fs.readdir(locales, (err, files) => {
    if (err) {
      throw err
    }

    const csvs = files.map(file => `${locales}/${file}`).filter(file => path.extname(file) === '.csv')
    const byLanguageModules = fromPairs(csvs.map(csvFile => [path.basename(csvFile, '.csv'), loadModules(csvFile, 'target_language')]))

    if (!csvs) {
      throw  new Error('A minimum of one CSV is required in order to build a JSON!')
    }

    const sourceModules = loadModules(csvs[0], 'source_language')

    const byLanguageModulesWithSourceLanguage = {...byLanguageModules, [sourceLanguage]: sourceModules}

    const languageKeys = [sourceLanguage, ...Object.keys(byLanguageModules).sort()] // Sort by language key, but sourceLanguage should be first
    const moduleKeys = Object.keys(sourceModules).sort() // Sort by module key

    const json = fromPairs(moduleKeys.map(moduleKey => [
      moduleKey,
      fromPairs(languageKeys.map(languageKey => [
        languageKey,
        byLanguageModulesWithSourceLanguage[languageKey][moduleKey]]))])
    )

    fs.writeFileSync(toPath, JSON.stringify(json, null, 2) + '\n', 'utf-8')

    const logMessages = Object.entries(json).map(([moduleKey, module]) => `Languages is module ${moduleKey}: ${Object.keys(module).length}`)

    logMessages.forEach(message => console.log(message))
  })
}

program
  .command('convert <locales_file> <toPath> <format>')
  .action(function (fromPath, toPath, targetFormat, options) {
    const {targetLanguages, sourceLanguage} = JSON.parse(fs.readFileSync(program.config, 'utf8'))

    if (targetFormat === 'csv') {
      if (path.extname(fromPath) === '.json') {
        const json = JSON.parse(fs.readFileSync(fromPath, 'utf8'))
        writeCsvFromJson(json, toPath, sourceLanguage, targetLanguages)
      } else {
        throw new Error('nyi')
      }
    } else if (targetFormat === 'json') {
      writeJsonFromCsv(fromPath, toPath, sourceLanguage)
    } else {
      throw new Error('nyi')
    }
  })

program.parse(process.argv)
