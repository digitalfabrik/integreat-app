import { deepmerge } from 'deepmerge-ts'

import translations from './translations/index.ts'
import type { TranslationsType } from './types.ts'

const defaultTranslations: TranslationsType = translations

const loadTranslations = (translationsOverride?: TranslationsType): TranslationsType =>
  translationsOverride ? deepmerge(defaultTranslations, translationsOverride) : defaultTranslations

export default loadTranslations
