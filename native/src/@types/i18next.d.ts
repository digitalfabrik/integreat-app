import 'i18next'

import type { TranslationsResources } from 'translations'

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: TranslationsResources
    enableSelector: 'strict'
  }
}
