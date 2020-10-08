// @flow

import { merge } from 'lodash'
import defaultLocales from 'locales/locales.json'
import buildConfig from '../app/constants/buildConfig'
import transformLocales from './transformLocales'

export type TransformedLocalesType = { [language: string]: { [namespace: string]: { [key: string]: string } } }

const loadLocales = (): TransformedLocalesType => {
  const localesOverride = buildConfig().localesOverride
  // // If keys are missing in 'defaultLocales', merge does not include those
  // // https://lodash.com/docs/4.17.15#merge
  const locales = localesOverride ? merge(defaultLocales, localesOverride) : defaultLocales
  return transformLocales(locales)
}

export default loadLocales
