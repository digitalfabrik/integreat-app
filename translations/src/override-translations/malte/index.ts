import type { TranslationsType } from '../../types.ts'
import de from './de.json' with { type: 'json' }
import en from './en.json' with { type: 'json' }

const translations = {
  de,
  en,
} satisfies TranslationsType

export default translations
