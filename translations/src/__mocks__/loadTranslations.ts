import transformTranslations from '../transformTranslations.ts'
import type { TransformedTranslationsType, TranslationsType } from '../types.ts'

export const testTranslations: TranslationsType = {
  app: {
    de: {
      pageTitles: {
        notFound: 'Seite nicht gefunden',
        tuNews: 'tünews',
        news: 'Nachrichten',
      },
      metaDescription:
        'Integreat ist Ihr digitaler Guide für Deutschland. Finden Sie lokale Informationen, Veranstaltungen und Beratung. Immer aktuell und in Ihrer Sprache.',
    },
  },
  layout: {
    kmr: {
      localInformation: 'Zanyariyên xwecihî',
    },
    de: {
      localInformation: 'Lokale Informationen',
      events: 'Veranstaltungen',
      news: 'Nachrichten',
      newsAlternative: 'Neuigkeiten',
    },
    ar: {
      localInformation: 'معلومات محلية',
      events: 'الفعاليات',
    },
    'zh-CN': {
      localInformation: '本地信息',
    },
  },
}

export const testOverrideTranslations: TranslationsType = {
  dashboard: {
    de: {
      localInformation: 'Malte Informationen',
      news: 'Malte Nachrichten',
    },
    en: {
      localInformation: 'Malte information',
      events: 'Malte Events',
    },
  },
}

const loadTranslations = (): TransformedTranslationsType => transformTranslations(testTranslations)

export default loadTranslations
