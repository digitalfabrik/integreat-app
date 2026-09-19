import flat from 'flat'
import fs from 'fs'
import { isEqual } from 'lodash-es'
import path from 'path'

import config from './config.ts'
import { languageFilePath, LanguageTranslations, readLanguageFile } from './manage.js'

type FlatTranslations = Record<string, string>

const { referenceLanguage, sourceLanguage } = config
const FULLY_TRANSLATED_LANGUAGES = [referenceLanguage, sourceLanguage] as const

const flatten = (translations: unknown): FlatTranslations => flat(translations) satisfies FlatTranslations

const extractPlaceholders = (value: string): string[] => (value.match(/{{[^}]+}}/g) ?? []).sort()

// Tags later get replaced with <Trans /> components to render e.g. bold text or links
// <strong>text</strong> or <1>text</1>
const extractTags = (value: string): string[] => (value.match(/<\/?[a-zA-Z0-9]+>/g) ?? []).sort()

// i18next allows nesting translations within other translations: $t(namespace:key) or $t(key, { count: 1 })
// https://www.i18next.com/translation-function/nesting
const NESTED_KEY_PATTERN = /\$t\(([^),]+)(?:,[^)]*)?\)/g
const NAMESPACE_SEPARATOR = ':'
const KEY_SEPARATOR = '.'

const extractNestedKeys = (value: string): string[] =>
  [...value.matchAll(NESTED_KEY_PATTERN)].map(match => match[1]?.trim() ?? '').sort()

// Nested keys are either namespace qualified (common:appName) or relative to the namespace they are used in
const resolveNestedKey = (nestedKey: string, key: string): string => {
  if (nestedKey.includes(NAMESPACE_SEPARATOR)) {
    return nestedKey.replace(NAMESPACE_SEPARATOR, KEY_SEPARATOR)
  }
  const namespace = key.split(KEY_SEPARATOR)[0] ?? key
  return `${namespace}${KEY_SEPARATOR}${nestedKey}`
}

export const findExtraKeys = (language: string, languageKeys: string[], referenceKeys: string[]): string[] =>
  languageKeys
    .filter(key => !referenceKeys.includes(key))
    .map(key => `${language}.json: key does not exist in ${referenceLanguage}.json: ${key}`)

export const findMissingKeys = (language: string, languageKeys: string[], referenceKeys: string[]): string[] =>
  referenceKeys
    .filter(key => !languageKeys.includes(key))
    .map(key => `${language}.json: key missing from a fully translated language: ${key}`)

export const findEmptyValues = (language: string, translations: FlatTranslations): string[] =>
  Object.entries(translations)
    .filter(([, value]) => value === '')
    .map(([key]) => `${language}.json: ${key}: empty value`)

const findPlaceholderMismatches = (
  language: string,
  referenceTranslations: FlatTranslations,
  translations: FlatTranslations,
): string[] =>
  Object.entries(translations)
    .map(([key, value]) => [key, extractPlaceholders(referenceTranslations[key] ?? ''), extractPlaceholders(value)])
    .filter(([, referencePlaceholders, languagePlaceholders]) => !isEqual(referencePlaceholders, languagePlaceholders))
    .map(
      ([key, referencePlaceholders, languagePlaceholders]) =>
        `${language}.json: ${key}: placeholders differ from ${referenceLanguage}.json ` +
        `(${referenceLanguage}=${JSON.stringify(referencePlaceholders)}, ` +
        `${language}=${JSON.stringify(languagePlaceholders)})`,
    )

const findTagMismatches = (
  language: string,
  referenceTranslations: FlatTranslations,
  translations: FlatTranslations,
): string[] =>
  Object.entries(translations)
    .map(([key, value]) => [key, extractTags(referenceTranslations[key] ?? ''), extractTags(value)])
    .filter(([, referenceTags, languageTags]) => !isEqual(referenceTags, languageTags))
    .map(
      ([key, referenceTags, languageTags]) =>
        `${language}.json: ${key}: tags differ from ${referenceLanguage}.json ` +
        `(${referenceLanguage}=${JSON.stringify(referenceTags)}, ${language}=${JSON.stringify(languageTags)})`,
    )

export const findNestingMismatches = (
  language: string,
  referenceTranslations: FlatTranslations,
  translations: FlatTranslations,
): string[] =>
  Object.entries(translations)
    .map(([key, value]) => [key, extractNestedKeys(referenceTranslations[key] ?? ''), extractNestedKeys(value)])
    .filter(([, referenceNestedKeys, languageNestedKeys]) => !isEqual(referenceNestedKeys, languageNestedKeys))
    .map(
      ([key, referenceNestedKeys, languageNestedKeys]) =>
        `${language}.json: ${key}: nested keys differ from ${referenceLanguage}.json ` +
        `(${referenceLanguage}=${JSON.stringify(referenceNestedKeys)}, ` +
        `${language}=${JSON.stringify(languageNestedKeys)})`,
    )

export const findUnknownNestedKeys = (
  language: string,
  referenceTranslations: FlatTranslations,
  translations: FlatTranslations,
): string[] =>
  Object.entries(translations).flatMap(([key, value]) =>
    extractNestedKeys(value)
      .map(nestedKey => resolveNestedKey(nestedKey, key))
      .filter(nestedKey => referenceTranslations[nestedKey] === undefined)
      .map(
        nestedKey => `${language}.json: ${key}: nested key does not exist in ${referenceLanguage}.json: ${nestedKey}`,
      ),
  )

const validateTranslation = (
  name: string,
  translations: LanguageTranslations,
  referenceFlat: FlatTranslations,
): string[] => {
  const referenceKeys = Object.keys(referenceFlat)
  const languageFlat = flatten(translations)
  const languageKeys = Object.keys(languageFlat)

  return [
    ...(FULLY_TRANSLATED_LANGUAGES.includes(name) ? findMissingKeys(name, languageKeys, referenceKeys) : []),
    ...findExtraKeys(name, languageKeys, referenceKeys),
    ...findEmptyValues(name, languageFlat),
    ...findPlaceholderMismatches(name, referenceFlat, languageFlat),
    ...findTagMismatches(name, referenceFlat, languageFlat),
    ...findNestingMismatches(name, referenceFlat, languageFlat),
    ...findUnknownNestedKeys(name, referenceFlat, languageFlat),
  ]
}

const validateOverride = (overrideDir: string, referenceFlat: FlatTranslations): string[] => {
  const brand = path.basename(overrideDir)
  const languages = fs
    .readdirSync(overrideDir)
    .filter(file => path.extname(file) === '.json')
    .map(file => path.basename(file, '.json'))
    .sort()

  return languages.flatMap(language =>
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    validateTranslation(`${brand}/${language}`, readLanguageFile(overrideDir, language)!, referenceFlat),
  )
}

export const validateTranslations = (dir: string, overridesDir: string): string[] => {
  const reference = readLanguageFile(dir, referenceLanguage)
  if (!reference) {
    return [`Missing reference language file ${languageFilePath(dir, referenceLanguage)}`]
  }

  const referenceFlat = flatten(reference)
  const errors = findEmptyValues(referenceLanguage, referenceFlat)

  const languages = fs
    .readdirSync(dir)
    .filter(file => path.extname(file) === '.json')
    .map(file => path.basename(file, '.json'))
    .sort()

  languages.forEach(language =>
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    errors.push(...validateTranslation(language, readLanguageFile(dir, language)!, referenceFlat)),
  )

  fs.readdirSync(overridesDir, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .forEach(entry => errors.push(...validateOverride(path.join(overridesDir, entry.name), referenceFlat)))

  return errors
}
