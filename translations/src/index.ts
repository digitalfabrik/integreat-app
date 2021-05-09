import type {
  TransformedTranslationsType as ImportedTransformedTranslationsType,
  TranslationsType as ImportedTranslationsType
} from './types'
export type TranslationsType = ImportedTranslationsType
export type TransformedTranslationsType = ImportedTransformedTranslationsType
export { default as loadTranslations } from './loadTranslations'
export { default as config } from './config'
export { values, entries } from './utils/object'
