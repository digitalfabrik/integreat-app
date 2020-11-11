// @flow

import type { JsonAvailableLanguagesType } from './types'
import normalizePath from './normalizePath'

const mapAvailableLanguages = (json: JsonAvailableLanguagesType): Map<string, string> =>
  new Map(Object.keys(json).map(key => [key, normalizePath(json[key].path)]))

export default mapAvailableLanguages
