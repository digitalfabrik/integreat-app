// @flow

import type { JsonAvailableLanguagesType } from './types'
import normalizePath from './normalizePath'
import { toPairs } from 'lodash/object'

const mapAvailableLanguages = (json: JsonAvailableLanguagesType): Map<string, string> =>
  new Map(toPairs(json).map(([key, value]) => [key, normalizePath(value.path)]))

export default mapAvailableLanguages
