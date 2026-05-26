import type {
  TransformedTranslationsType as ImportedTransformedTranslationsType,
  TranslationsType as ImportedTranslationsType,
} from './types.js'

export type TranslationsType = ImportedTranslationsType
export type TransformedTranslationsType = ImportedTransformedTranslationsType
export { default as loadTranslations } from './loadTranslations.js'
export type { UiDirectionType } from './config.js'
export { default as config } from './config.js'
