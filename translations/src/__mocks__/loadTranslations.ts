import type { TranslationsType } from '../types.ts'

export const testTranslations: TranslationsType = {
  de: {
    app: {
      pageTitles: {
        notFound: 'Seite nicht gefunden',
        tuNews: 'tünews',
        news: 'Nachrichten',
      },
      metaDescription:
        'Integreat ist Ihr digitaler Guide für Deutschland. Finden Sie lokale Informationen, Veranstaltungen und Beratung. Immer aktuell und in Ihrer Sprache.',
    },
    layout: {
      localInformation: 'Lokale Informationen',
      events: 'Veranstaltungen',
      news: 'Nachrichten',
      newsAlternative: 'Neuigkeiten',
    },
  },
  ar: {
    layout: {
      localInformation: 'معلومات محلية',
      events: 'الفعاليات',
    },
  },
  kmr: {
    layout: {
      localInformation: 'Zanyariyên xwecihî',
    },
  },
  'zh-CN': {
    layout: {
      localInformation: '本地信息',
    },
  },
}

export const testOverrideTranslations: TranslationsType = {
  de: {
    dashboard: {
      localInformation: 'Malte Informationen',
      news: 'Malte Nachrichten',
    },
  },
  en: {
    dashboard: {
      localInformation: 'Malte information',
      events: 'Malte Events',
    },
  },
}

const loadTranslations = (): TranslationsType => testTranslations

export default loadTranslations
