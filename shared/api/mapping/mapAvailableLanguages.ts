import { JsonAvailableLanguagesType } from '..'

import normalizePath from '../../utils/normalizePath'

const mapAvailableLanguages = (json: JsonAvailableLanguagesType): Record<string, string> =>
  Object.entries(json).reduce(
    (availableLanguages, [code, value]) => ({ ...availableLanguages, [code]: normalizePath(value.path) }),
    {},
  )

export default mapAvailableLanguages
