import type {
  TransformedTranslationsType as ImportedTransformedTranslationsType,
  TranslationsType as ImportedTranslationsType,
} from './types.ts'

export type TranslationsType = ImportedTranslationsType
export type TransformedTranslationsType = ImportedTransformedTranslationsType
export { default as loadTranslations } from './loadTranslations.ts'
export type { UiDirectionType } from './config.ts'
export { default as config } from './config.ts'
