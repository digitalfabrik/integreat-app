import {
  TransformedTranslationsType as ImportedTransformedTranslationsType,
  TranslationsType as ImportedTranslationsType,
} from './types'

export type TranslationsType = ImportedTranslationsType
export type TransformedTranslationsType = ImportedTransformedTranslationsType
export { default as loadTranslations } from './loadTranslations'
export type { UiDirectionType } from './config'
export { default as config } from './config'
