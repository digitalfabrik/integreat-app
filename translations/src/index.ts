import resources from './resources.gen.ts'

export type { TranslationsType } from './types.ts'
export type TranslationsResources = typeof resources
export { default as loadTranslations } from './loadTranslations.ts'
export type { UiDirectionType } from './config.ts'
export { default as config } from './config.ts'
