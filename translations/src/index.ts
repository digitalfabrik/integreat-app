import sourceTranslations from './translations/de.json' with { type: 'json' }

export type { TranslationsType } from './types.ts'
export type TranslationsResources = typeof sourceTranslations
export { default as loadTranslations } from './loadTranslations.ts'
export type { UiDirectionType } from './config.ts'
export { default as config } from './config.ts'
