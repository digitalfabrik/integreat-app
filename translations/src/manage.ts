import { program } from 'commander'
import { parse } from 'csv-parse/sync'
import { stringify } from 'csv-stringify'
import flat from 'flat'
import fs from 'fs'
import { fromPairs, sortBy, toPairs, union } from 'lodash-es'
import path from 'path'

import config from '../src/config.js'
import { validateTranslations } from './validate.ts'

const { unflatten } = flat

const CSV_KEY_COLUMN = 'key'
const MAX_REPORTED_DIFFERENCES = 5

type TranslationMap = { [key: string]: string | TranslationMap }
export type LanguageTranslations = { [namespace: string]: TranslationMap }

export const languageFilePath = (dir: string, language: string, extension = '.json'): string =>
  path.join(dir, `${language}${extension}`)

export const readLanguageFile = (dir: string, language: string): LanguageTranslations | null => {
  const filePath = languageFilePath(dir, language)
  if (!fs.existsSync(filePath)) {
    return null
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) satisfies LanguageTranslations
}

const exportTranslationsToCsv = (
  fromDir: string,
  toDir: string,
  sourceLanguage: string,
  referenceLanguage: string,
  supportedLanguages: string[],
) => {
  const sourceTranslations = readLanguageFile(fromDir, sourceLanguage)
  if (!sourceTranslations) {
    throw new Error(`Missing source language (${sourceLanguage}) translations file`)
  }
  const flatSource = flat(sourceTranslations) satisfies Record<string, string>
  const sourceEntries = sortBy(toPairs(flatSource), ([key]) => key)
  const flatReference = flat(readLanguageFile(fromDir, referenceLanguage) ?? {}) satisfies Record<string, string>

  supportedLanguages
    .filter(language => ![sourceLanguage, referenceLanguage].includes(language))
    .forEach(language => {
      const flatTarget = flat(readLanguageFile(fromDir, language) ?? {}) satisfies Record<string, string>
      const rows = sourceEntries.map(([key, sourceValue]) => [
        key,
        sourceValue,
        flatReference[key] ?? '',
        flatTarget[key] ?? '',
      ])

      const csvPath = languageFilePath(toDir, language, '.csv')
      const output = fs.createWriteStream(csvPath)
      output.on('close', () => console.log(`Successfully written ${csvPath}`))
      output.on('error', error => console.log(`Failed to write ${csvPath}.csv: ${error}`))
      stringify([[CSV_KEY_COLUMN, sourceLanguage, referenceLanguage, language], ...rows]).pipe(output)
    })

  console.log(`Keys in source language ${sourceLanguage}: ${sourceEntries.length}`)
}

program.command('export <fromPath> <toPath>').action((fromPath: string, toPath: string) => {
  const { supportedLanguages, sourceLanguage, referenceLanguage } = config
  if (!fs.existsSync(toPath)) {
    fs.mkdirSync(toPath, { recursive: true })
  }
  exportTranslationsToCsv(fromPath, toPath, sourceLanguage, referenceLanguage, Object.keys(supportedLanguages))
})

const loadColumn = (csvFile: string, columnName: string): LanguageTranslations => {
  const fileContent = fs.readFileSync(csvFile, { encoding: 'utf8' }).trim()
  const rows = parse(fileContent, { columns: true, skip_empty_lines: true }) satisfies Record<string, string>[]
  const column = fromPairs(rows.map(row => [row.key, row[columnName]]).filter(([, value]) => !!value))
  return unflatten(column)
}

const describeDifferences = (expected: LanguageTranslations, actual: LanguageTranslations): string[] => {
  const expectedFlat = flat(expected) satisfies Record<string, string>
  const actualFlat = flat(actual) satisfies Record<string, string>
  return union(Object.keys(expectedFlat), Object.keys(actualFlat))
    .sort()
    .filter(key => expectedFlat[key] !== actualFlat[key])
    .map(key => `${key}: expected '${expectedFlat[key] ?? ''}' but got '${actualFlat[key] ?? ''}'`)
}

// The source and reference language columns are only meant as translation aid and must not be modified by translators
const loadSharedColumn = (csvs: string[], firstCsv: string, column: string): LanguageTranslations => {
  const expected = loadColumn(firstCsv, column)
  csvs.forEach(csv => {
    const differences = describeDifferences(expected, loadColumn(csv, column))
    if (differences.length > 0) {
      const reported = differences.slice(0, MAX_REPORTED_DIFFERENCES).map(difference => `  ${difference}`)
      const omitted = differences.length - reported.length
      throw new Error(
        `The column '${column}' must be the same in every CSV, but ${path.basename(csv)} differs from ` +
          `${path.basename(firstCsv)} in ${differences.length} key(s). ` +
          `Only the column of the language a CSV is named after may be modified.\n${reported.join('\n')}${
            omitted > 0 ? `\n  ... and ${omitted} more` : ''
          }`,
      )
    }
  })
  return expected
}

const importTranslationsFromCsv = (fromDir: string, toDir: string, sourceLanguage: string) => {
  const csvs = fs
    .readdirSync(fromDir)
    .map(file => path.join(fromDir, file))
    .filter(file => path.extname(file) === '.csv')

  const firstCsv = csvs[0]
  if (!firstCsv) {
    throw new Error(`No CSVs in directory ${fromDir} found`)
  }

  const sourceTranslations = loadSharedColumn(csvs, firstCsv, sourceLanguage)
  // The reference language is not imported, but it still must not have been modified
  loadSharedColumn(csvs, firstCsv, config.referenceLanguage)

  const translations = {
    [sourceLanguage]: sourceTranslations,
    ...fromPairs(
      csvs.map(csv => {
        const language = path.basename(csv, '.csv')
        return [language, loadColumn(csv, language)]
      }),
    ),
  } satisfies Record<string, LanguageTranslations>

  const importedLanguages = Object.keys(translations)
  const supportedLanguages = Object.keys(config.supportedLanguages).filter(
    language => language !== config.referenceLanguage,
  )
  const unsupportedLanguages = importedLanguages.filter(language => !supportedLanguages.includes(language))
  const missingLanguages = supportedLanguages.filter(language => !importedLanguages.includes(language))
  if (unsupportedLanguages.length > 0) {
    throw new Error(`The languages ${unsupportedLanguages} are not supported. Please add them first in the config.`)
  }
  console.warn(`Importing languages ${importedLanguages}`)
  if (missingLanguages.length > 0) {
    console.log(`WARNING: The following languages are missing: ${missingLanguages}`)
  }

  if (!fs.existsSync(toDir)) {
    fs.mkdirSync(toDir, { recursive: true })
  }

  Object.entries(translations).forEach(([language, languageTranslations]) => {
    const namespaces = Object.keys(languageTranslations)
    const sourceLanguageNamespaces = Object.keys(translations[sourceLanguage] ?? {})
    if (namespaces.length === 0) {
      console.log(`WARNING: Empty translations file for language ${language}. Skipping.`)
      return
    }
    if (namespaces.length !== sourceLanguageNamespaces.length) {
      console.log(
        `WARNING: Only ${namespaces.length} namespaces in ${language} (${sourceLanguage}: ${sourceLanguageNamespaces.length})`,
      )
    }

    const sortedNamespaces = fromPairs(sortBy(toPairs(languageTranslations), ([namespace]) => namespace))
    const json = JSON.stringify(sortedNamespaces, null, 2)
    fs.writeFileSync(languageFilePath(toDir, language), `${json}\n`, 'utf-8')
  })
}

program
  .command('import <fromPath> <toPath>')
  .action((fromPath: string, toPath: string) => importTranslationsFromCsv(fromPath, toPath, config.sourceLanguage))

const identifierForLanguage = (language: string): string =>
  language.replace(/-([a-zA-Z])/g, (_, char: string) => char.toUpperCase())

const writeIndex = (dir: string, typesRelativePath: string) => {
  const languages = fs
    .readdirSync(dir)
    .filter(file => path.extname(file) === '.json')
    .map(file => path.basename(file, '.json'))
    .sort()

  if (languages.length === 0) {
    console.warn(`No JSON files in ${dir}. Skipping.`)
    return
  }

  const imports = languages
    .map(language => `import ${identifierForLanguage(language)} from './${language}.json' with { type: 'json' }`)
    .join('\n')
  const entries = languages
    .map(language => {
      const identifier = identifierForLanguage(language)
      return identifier === language ? `  ${language},` : `  '${language}': ${identifier},`
    })
    .join('\n')

  const content = `import type { TranslationsType } from '${typesRelativePath}'
${imports}

const translations = {
${entries}
} satisfies TranslationsType

export default translations
`

  const filePath = path.join(dir, 'index.ts')
  fs.writeFileSync(filePath, content, 'utf-8')
  console.log(`Wrote ${filePath} with ${languages.length} languages`)
}

const RESOURCES_GEN_PATH = 'src/resources.gen.ts'
const TRANSLATIONS_DIR = 'src/translations'
const TRANSLATIONS_OVERRIDE_DIR = 'src/override-translations'

const writeTypes = () => {
  const filePath = languageFilePath('src/translations', config.referenceLanguage)
  const parsed = JSON.parse(fs.readFileSync(filePath, 'utf-8')) satisfies LanguageTranslations
  const banner = `// AUTO-GENERATED from ${config.referenceLanguage}.json by \`yarn workspace translations sync\`. Do not edit.\n`
  const body = `const resources = ${JSON.stringify(parsed, null, 2)} as const\n\nexport default resources\n`
  fs.writeFileSync(RESOURCES_GEN_PATH, `${banner}\n${body}`, 'utf-8')
  console.log(`Wrote ${RESOURCES_GEN_PATH}`)
}

program.command('sync').action(() => {
  writeIndex(TRANSLATIONS_DIR, '../types.ts')
  fs.readdirSync(TRANSLATIONS_OVERRIDE_DIR, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .forEach(entry => writeIndex(path.join(TRANSLATIONS_OVERRIDE_DIR, entry.name), '../../types.ts'))
  writeTypes()
})

type WritePlistTranslationsOptions = {
  translations: string
  destination: string
}

const writePlistTranslations = (appName: string, { translations, destination }: WritePlistTranslationsOptions) => {
  const languages = Object.keys(config.supportedLanguages).filter(language =>
    fs.existsSync(languageFilePath(translations, language)),
  )
  if (languages.length === 0) {
    throw new Error(`Empty directory ${destination}`)
  }
  console.warn(`Creating InfoPlist.strings for the languages ${languages}`)
  languages.forEach(language => {
    const iosTranslations = readLanguageFile(translations, language)?.ios
    if (!iosTranslations) {
      console.warn(`No iOS translations found for language ${language}. Skipping.`)
      return
    }
    const content = Object.entries(iosTranslations)
      .filter((entry): entry is [string, string] => typeof entry[1] === 'string')
      .map(([key, value]) => `${key} = "${value.replace(/{{appName}}/gi, appName)}";`)
      .join('\n')

    // XCode uses different tags for some languages
    const xcodeLanguagesMap: Record<string, string> = {
      'sr-Cyrl': 'sr',
      pes: 'fa',
      prs: 'fa-AF',
      kmr: 'ku',
      'zh-CN': 'zh-HANS',
    } as const
    const languageKey = xcodeLanguagesMap[language] ?? language

    const outPath = `${destination}/${languageKey}.lproj/`
    fs.mkdirSync(outPath, { recursive: true })
    fs.writeFileSync(`${outPath}InfoPlist.strings`, content)
  })
  console.warn('InfoPlist.strings successfully created.')
}

program
  .command('write-plist <appName>')
  .description('setup translations for ios')
  .requiredOption('--translations <translations>', 'the path to the translations dir')
  .requiredOption('--destination <destination>', 'the path to put the string resources to')
  .action((appName: string, options: WritePlistTranslationsOptions) => {
    try {
      writePlistTranslations(appName, options)
    } catch (e) {
      console.error(e)
      process.exit(1)
    }
  })

program.command('validate').action(() => {
  const errors = validateTranslations(TRANSLATIONS_DIR, TRANSLATIONS_OVERRIDE_DIR)
  if (errors.length > 0) {
    console.error(`Found ${errors.length} translation issue(s):`)
    errors.forEach(error => console.error(`  ${error}`))
    process.exit(1)
  }
  console.log('Translations valid.')
})

program.parse(process.argv)
