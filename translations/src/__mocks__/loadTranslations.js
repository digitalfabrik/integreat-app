// @flow

import transformTranslations from '../transformTranslations'
import type { TransformedTranslationsType, TranslationsType } from '../types'

export const testTranslations: TranslationsType = {
  app: {
    de: {
      pageTitles: {
        notFound: 'Seite nicht gefunden',
        tunews: 'tünews',
        localNews: 'Lokale Nachrichten'
      },
      metaDescription: 'Integreat ist Ihr digitaler Guide für Deutschland. Finden Sie lokale Informationen, Veranstaltungen und Beratung. Immer aktuell und in Ihrer Sprache.'
    }
  },
  dashboard: {
    ckb: {
      localInformation: 'Zanyariyên xwecihî'
    },
    de: {
      localInformation: 'Lokale Informationen',
      offers: 'Angebote',
      events: 'Veranstaltungen',
      news: 'Nachrichten',
      newsAlternative: 'Neuigkeiten'
    },
    ar: {
      localInformation: 'معلومات محلية',
      offers: 'العروض',
      events: 'الفعاليات'
    },
    "zh-CN": {
      "localInformation": "本地信息",
    }
  }
}
// eslint-disable-next-line no-unused-vars
export const testOverrideTranslations: TranslationsType = {
  dashboard: {
    de: {
      localInformation: 'Malte Informationen',
      offers: 'Malte Angebote',
      news: 'Malte Nachrichten'
    },
    en: {
      localInformation: 'Malte information',
      offers: 'Malte Offers',
      events: 'Malte Events'
    }
  }
}

const loadTranslations = (): TransformedTranslationsType => {
  return transformTranslations(testTranslations)
}

export default loadTranslations
