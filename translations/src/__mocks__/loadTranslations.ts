import type { TranslationsType } from '../types.ts'

export const testTranslations: TranslationsType = {
  de: {
    categories: {
      title: 'Lokale Informationen',
      events: 'Veranstaltungen',
    },
    events: {
      title: 'Veranstaltungen',
    },
    news: {
      title: 'Nachrichten',
    },
  },
  ar: {
    categories: {
      title: 'معلومات محلية',
    },
    events: {
      title: 'الفعاليات',
    },
  },
  kmr: {
    categories: {
      title: 'Zanyariyên xwecihî',
    },
  },
  'zh-CN': {
    categories: {
      title: '本地信息',
    },
  },
}

export const testOverrideTranslations: TranslationsType = {
  de: {
    categories: {
      title: 'Malte Informationen',
    },
    news: {
      title: 'Malte Nachrichten',
    },
  },
  en: {
    categories: {
      title: 'Malte information',
    },
    events: {
      title: 'Malte Events',
    },
  },
}

const loadTranslations = (): TranslationsType => testTranslations

export default loadTranslations
