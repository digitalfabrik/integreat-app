import normalizePath from '../../utils/normalizePath.ts'
import { JsonAvailableLanguagesType } from '../types.ts'

const mapAvailableLanguages = (json: JsonAvailableLanguagesType): Record<string, string> =>
  Object.entries(json).reduce(
    (availableLanguages, [code, value]) => ({ ...availableLanguages, [code]: normalizePath(value.path) }),
    {},
  )

export default mapAvailableLanguages
