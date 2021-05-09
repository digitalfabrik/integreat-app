import fs from "fs";
import program from "commander";
import path from "path";
import flat from "flat";

const { unflatten } = flat

const stringify = require('csv-stringify')

const parse = require('csv-parse/lib/sync')

const config = require('../src/config.js').default

const { isEmpty, without, isString, merge, fromPairs, toPairs, zip, sortBy, mapValues, isEqual } = require('lodash')

program.version('0.1.0').option('-d, --debug', 'enable extreme logging')

const mapStringValuesDeep = (obj, fn) =>
  mapValues(obj, (val, key) => (!isString(val) ? mapStringValuesDeep(val, fn) : fn(val, key, obj)))

const flattenModules = modules => {
  return flat(modules)
}

const writePairs = (toPath, sourceLanguagePairs, pairs, name) => {
  const output = fs.createWriteStream(`${toPath}/${name}.csv`)
  output.on('close', () => {
    console.log(`Successfully written ${name}.csv.`)
  })
  output.on('error', e => {
    console.log(`Failed to write ${name}.csv ${e}`)
  })
  const withSourceLanguagePairs = zip(
    sourceLanguagePairs,
    pairs
  ).map(([[sourceKey, sourceTranslation], [key, translation]]) => [key, sourceTranslation, translation])
  stringify([['key', 'source_language', 'target_language'], ...withSourceLanguagePairs]).pipe(output)
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
  return getModulesByLanguage(moduleArray, language).map(([moduleKey, module]) => {
    if (module === EMPTY_MODULE) {
      throw new Error(`Module ${moduleKey} is missing in source language!`)
    }

    return [moduleKey, mapStringValuesDeep(module, translation => '')]
  })
}

const getModulesByLanguage = (keyModuleArray, language) => {
  return keyModuleArray.map(([moduleKey, module]) => [moduleKey, module[language] || EMPTY_MODULE])
}

const mergeByLanguageModule = (byLanguageModule, skeleton, sourceLanguage) => {
  return zip(skeleton, byLanguageModule).map(([[skModuleKey, skModule], [moduleKey, module]]) => {
    const diff = without(Object.keys(flat(module)), ...Object.keys(flat(skModule)))

    if (!isEmpty(diff)) {
      throw new Error(`The keys [${diff}] are missing in module ${moduleKey} 
                        (with the  source language ${sourceLanguage})!`)
    }

    return [moduleKey, merge({}, skModule, module)]
  })
}

const writeCsvFromJson = (json, toPath, sourceLanguage, supportedLanguages) => {
  const moduleArray = sortBy(toPairs(json), ([moduleKey, module]) => moduleKey) // Sort by module key

  const byLanguageModuleArray = fromPairs(
    supportedLanguages
      .filter(language => language !== sourceLanguage) // source language is not a target language
      .map(targetLanguage => [targetLanguage, getModulesByLanguage(moduleArray, targetLanguage)])
  )
  const skeleton = createSkeleton(sourceLanguage, moduleArray)
  const filledByLanguageModuleArray = mapValues(byLanguageModuleArray, byLanguageModule => {
    return mergeByLanguageModule(byLanguageModule, skeleton, sourceLanguage)
  })
  const flattenByLanguage = mapValues(filledByLanguageModuleArray, modules => flattenModules(fromPairs(modules)))
  const flattenSourceLanguage = flattenModules(fromPairs(getModulesByLanguage(moduleArray, sourceLanguage)))
  Object.entries(flattenByLanguage).forEach(([languageKey, modules]) =>
    writePairs(toPath, toPairs(flattenSourceLanguage), toPairs(modules), languageKey)
  )
  console.log(`Keys in source language ${sourceLanguage}: ${Object.keys(flattenSourceLanguage).length}`)
}

const loadModules = (csvFile, csvColumn) => {
  // .trim() is needed to strip the BOM
  const inputString = fs
    .readFileSync(csvFile, {
      encoding: 'utf8'
    })
    .trim()
  const records = parse(inputString, {
    columns: true,
    skip_empty_lines: true
  })
  const flattened = fromPairs(
    records.map(record => [record.key, record[csvColumn]]).filter(([key, translation]) => !!translation)
  )
  return unflatten(flattened)
}

const writeJsonFromCsv = (translations, toPath, sourceLanguage) => {
  fs.readdir(translations, (err, files) => {
    if (err) {
      throw err
    }

    const csvs = files.map(file => `${translations}/${file}`).filter(file => path.extname(file) === '.csv')

    if (isEmpty(csvs)) {
      throw new Error('A minimum of one CSV is required in order to build a JSON!')
    }

    const byLanguageModules = fromPairs(
      csvs.map(csvFile => [path.basename(csvFile, '.csv'), loadModules(csvFile, 'target_language')])
    )
    const sourceModules = loadModules(csvs[0], 'source_language')
    // Show which source languages differ
    csvs.forEach((csv, index) => {
      if (!isEqual(loadModules(csv, 'source_language'), sourceModules)) {
        console.log('source language 1', sourceModules)
        console.log()
        console.log()
        console.log()
        console.log('index', index)
        console.log('source language 2', loadModules(csv, 'source_language'))
      }
    })

    if (!csvs.every(csv => isEqual(loadModules(csv, 'source_language'), sourceModules))) {
      throw new Error("The 'source_language' column must be the same in every CSV!")
    }

    const byLanguageModulesWithSourceLanguage = { ...byLanguageModules, [sourceLanguage]: sourceModules }
    // Sort by language key, but sourceLanguage should be first
    const languageKeys = [sourceLanguage, ...Object.keys(byLanguageModules).sort()]
    // Sort by module key
    const moduleKeys = Object.keys(sourceModules).sort()
    const json = fromPairs(
      moduleKeys.map(moduleKey => [
        moduleKey,
        fromPairs(
          languageKeys.map(languageKey => [languageKey, byLanguageModulesWithSourceLanguage[languageKey][moduleKey]])
        )
      ])
    )
    fs.writeFileSync(toPath, `${JSON.stringify(json, null, 2)}\n`, 'utf-8')
    const logMessages = Object.entries(json).map(
      ([moduleKey, module]) => `Languages in module ${moduleKey}: ${Object.keys(module).length}`
    )
    logMessages.forEach(message => console.log(message))
  })
}

program
  .command('convert <translations_file> <toPath> <format>')
  .action(function (fromPath, toPath, targetFormat, options) {
    const { supportedLanguages, sourceLanguage } = config
    const sourceFormat = path.extname(fromPath).replace('.', '') || 'csv'
    const converter = {
      'json-csv': () => {
        if (!fs.existsSync(toPath)) {
          fs.mkdirSync(toPath)
        }

        const json = JSON.parse(fs.readFileSync(fromPath, 'utf8'))
        writeCsvFromJson(json, toPath, sourceLanguage, Object.keys(supportedLanguages))
      },
      'csv-json': () => {
        writeJsonFromCsv(fromPath, toPath, sourceLanguage)
      }
    }
    const convert = converter[`${sourceFormat.toLowerCase()}-${targetFormat.toLowerCase()}`]

    if (convert) {
      convert()
    } else {
      console.error(`Unable to convert from ${sourceFormat} to ${targetFormat}`)
      process.exit(1)
    }
  })

const writePlistTranslations = (appName, { translationsFile, destination }) => {
  const { native: nativeTranslations } = JSON.parse(fs.readFileSync(translationsFile, 'utf-8'))
  const languageCodes = Object.keys(nativeTranslations)
  console.warn('Creating InfoPlist.strings for the languages ', languageCodes)
  languageCodes.forEach(language => {
    const translations = nativeTranslations[language]
    const keys = Object.keys(translations)
    const content = keys
      .map(key => {
        const regex = /{{appName}}/gi
        const value = translations[key].replace(regex, appName)
        return `${key} = "${value}";`
      })
      .join('\n')
    const path = `${destination}/${language}.lproj/`
    fs.mkdirSync(path, {
      recursive: true
    })
    fs.writeFileSync(`${path}InfoPlist.strings`, content)
  })
  console.warn('InfoPlist.strings successfully created.')
}

program
  .command('write-plist <appName>')
  .requiredOption('--translations <translations>', 'the path to the translations.json file')
  .requiredOption('--destination <destination>', 'the path to put the string resources to')
  .description('setup native translations for ios')
  .action((appName, program) => {
    try {
      writePlistTranslations(appName, {
        translationsFile: program.translations,
        destination: program.destination
      })
    } catch (e) {
      console.error(e)
      process.exit(1)
    }
  })
program.parse(process.argv)
