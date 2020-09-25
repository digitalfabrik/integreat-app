// @flow

import locales from './locales.json'
import transformLocales from '../transformLocales'
import type { TransformedLocalesType } from '../loadLocales'

const loadLocales = (): TransformedLocalesType => {
  return transformLocales(locales)
}

export default loadLocales
