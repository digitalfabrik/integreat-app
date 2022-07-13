import { program } from 'commander'
import { parse } from 'csv-parse/lib/sync'
import { stringify } from 'csv-stringify'
import flat from 'flat'
import fs from 'fs'
import { fromPairs, isEmpty, isEqual, isString, mapValues, merge, sortBy, toPairs, without, zip } from 'lodash'
import path from 'path'

import { TranslationsType } from '../src'
import config from '../src/config'
import { KeyValueType } from '../src/types'

const { unflatten } = flat

const XCODE_LANGUAGES_MAP: Record<string, string> = {
  'sr-Cyrl': 'sr',
  pes: 'fa',
  prs: 'fa-AF',
  kmr: 'ku',
  'zh-CN': 'zh-HANS'
} as const

program.version('0.1.0').option('-d, --debug', 'enable extreme logging')

type TransformationFunctionType = (val: string | KeyValueType, key?: string, obj?: KeyValueType) => string
const mapStringValuesDeep = (obj: KeyValueType, fn: TransformationFunctionType): KeyValueType =>
  mapValues(obj, (val, key) => (!isString(val) ? mapStringValuesDeep(val, fn) : fn(val, key, obj)))

const flattenModules = (modules: KeyValueType): Record<string, string> => flat(modules)

type LanguagePair = [string, string]

const writePairs = (toPath: string, sourceLanguagePairs: LanguagePair[], pairs: LanguagePair[], name: string): void => {
  const output = fs.createWriteStream(`${toPath}/${name}.csv`)
  output.on('close', () => {
    console.log(`Successfully written ${name}.csv.`)
  })
  output.on('error', e => {
    console.log(`Failed to write ${name}.csv ${e}`)
  })
  const zippedLanguagePairs = zip(sourceLanguagePairs, pairs) as [LanguagePair, LanguagePair][]
  const withSourceLanguagePairs = zippedLanguagePairs.map(
    ([[_unusedSourceKey, sourceTranslation], [key, translation]]) => {
      if (!translation) {
        console.log('Missing translation:', key, '[', name, ']')
      }
      return [key, sourceTranslation, translation]
    }
  )
  stringify([['key', 'source_language', 'target_language'], ...withSourceLanguagePairs]).pipe(output)
}

const EMPTY_MODULE = {}

type KeyModuleType = [string, Record<string, KeyValueType>]
type ModuleType = [string, KeyValueType]

const getModulesByLanguage = (keyModuleArray: KeyModuleType[], language: string): ModuleType[] =>
  keyModuleArray.map(([moduleKey, module]) => [moduleKey, module[language] || EMPTY_MODULE])

/**
 * Create a a translation skeleton which has all keys set to an empty string
 *
 * @param language The language which serves as the skeleton
 * @param moduleArray The array of modules (containing all languages) with its keys
 * @returns {*}
 */
const createSkeleton = (language: string, moduleArray: KeyModuleType[]): ModuleType[] =>
  getModulesByLanguage(moduleArray, language).map(([moduleKey, module]) => {
    if (module === EMPTY_MODULE) {
      throw new Error(`Module ${moduleKey} is missing in source language!`)
    }

    return [moduleKey, mapStringValuesDeep(module, _unusedTranslation => '')]
  })

const mergeByLanguageModule = (
  byLanguageModule: ModuleType[],
  skeleton: ModuleType[],
  sourceLanguage: string
): ModuleType[] => {
  const zippedModuleArray = zip(skeleton, byLanguageModule) as [ModuleType, ModuleType][]
  return zippedModuleArray.map(([[_unusedSkModuleKey, skModule], [moduleKey, module]]) => {
    const diff = without(Object.keys(flat(module)), ...Object.keys(flat(skModule)))

    if (!isEmpty(diff)) {
      throw new Error(`The keys [${diff}] are missing in module ${moduleKey} 
                        (with the  source language ${sourceLanguage})!`)
    }

    return [moduleKey, merge({}, skModule, module)]
  })
}

const writeCsvFromJson = (
  json: TranslationsType,
  toPath: string,
  sourceLanguage: string,
  supportedLanguages: string[]
) => {
  const moduleArray = sortBy(toPairs(json), ([moduleKey, _unusedModule]) => moduleKey) // Sort by module key

  const byLanguageModuleArray = fromPairs<ModuleType[]>(
    supportedLanguages
      .filter(language => language !== sourceLanguage) // source language is not a target language
      .map(targetLanguage => [targetLanguage, getModulesByLanguage(moduleArray, targetLanguage)])
  )
  const skeleton = createSkeleton(sourceLanguage, moduleArray)
  const filledByLanguageModuleArray = mapValues(byLanguageModuleArray, byLanguageModule =>
    mergeByLanguageModule(byLanguageModule, skeleton, sourceLanguage)
  )
  const flattenByLanguage = mapValues(filledByLanguageModuleArray, modules => flattenModules(fromPairs(modules)))
  const flattenSourceLanguage = flattenModules(fromPairs(getModulesByLanguage(moduleArray, sourceLanguage)))
  Object.entries(flattenByLanguage).forEach(([languageKey, modules]) =>
    writePairs(toPath, toPairs(flattenSourceLanguage), toPairs(modules), languageKey)
  )
  console.log(`Keys in source language ${sourceLanguage}: ${Object.keys(flattenSourceLanguage).length}`)
}

const loadModules = (csvFile: string, csvColumn: string): Record<string, KeyValueType> => {
  // .trim() is needed to strip the BOM
  const inputString = fs
    .readFileSync(csvFile, {
      encoding: 'utf8'
    })
    .trim()
  const records: Record<string, string>[] = parse(inputString, {
    columns: true,
    skip_empty_lines: true
  })
  const flattened = fromPairs(
    records.map(record => [record.key, record[csvColumn]]).filter(([_unusedKey, translation]) => !!translation)
  )
  return unflatten(flattened)
}

const writeJsonFromCsv = (translations: string, toPath: string, sourceLanguage: string) => {
  fs.readdir(translations, (err, files) => {
    if (err) {
      throw err
    }

    const csvs = files.map(file => `${translations}${file}`).filter(file => path.extname(file) === '.csv')

    if (isEmpty(csvs)) {
      throw new Error('A minimum of one CSV is required in order to build a JSON!')
    }

    const byLanguageModules = fromPairs(
      csvs.map(csvFile => [path.basename(csvFile, '.csv'), loadModules(csvFile, 'target_language')])
    )
    const sourceLanguageCsv = csvs[0]
    if (!sourceLanguageCsv) {
      throw new Error('Need at least one csv!')
    }
    const sourceModules = loadModules(sourceLanguageCsv, 'source_language')
    const flatSourceModules: Record<string, string> = flat(sourceModules)
    // Show which source languages differ
    csvs.forEach(csv => {
      const csvModule = loadModules(csv, 'source_language')
      const flatCsv: Record<string, string> = flat(csvModule)
      const differingKey = Object.keys(flatCsv).find(key => flatSourceModules[key] !== flatCsv[key])

      if (differingKey) {
        console.log('differing key: ', differingKey)
        console.log(csvs[0], ': ', flatSourceModules[differingKey])
        console.log(csv, ': ', flatCsv[differingKey])
        console.log()
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
          languageKeys.map(languageKey => [languageKey, byLanguageModulesWithSourceLanguage[languageKey]![moduleKey]])
        )
      ])
    )
    fs.writeFileSync(toPath, `${JSON.stringify(json, null, 2)}\n`, 'utf-8')
    const logMessages = Object.entries(json).map(
      ([moduleKey, module]) =>
        `Languages in module ${moduleKey}: ${Object.keys(module).length} (${Object.keys(module)})`
    )
    logMessages.forEach(message => console.log(message))
  })
}

program
  .command('convert <translations_file> <toPath> <format>')
  .action((fromPath: string, toPath: string, targetFormat: string) => {
    const { supportedLanguages, sourceLanguage } = config
    const sourceFormat = path.extname(fromPath).replace('.', '') || 'csv'
    const converter: Record<string, () => void> = {
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

type ProcessTranslationsType = {
  translations: string
  destination: string
}

const writePlistTranslations = (appName: string, { translations, destination }: ProcessTranslationsType) => {
  const { native: nativeTranslations } = JSON.parse(fs.readFileSync(translations, 'utf-8'))
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

    // XCode uses different tags for some languages
    const languageKey = XCODE_LANGUAGES_MAP[language] ?? language
    const path = `${destination}/${languageKey}.lproj/`

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
  .action((appName: string, program: ProcessTranslationsType) => {
    try {
      writePlistTranslations(appName, program)
    } catch (e) {
      console.error(e)
      process.exit(1)
    }
  })
program.parse(process.argv)
