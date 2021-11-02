import normalizePath from './normalizePath'
import { JsonAvailableLanguagesType } from './types'

const mapAvailableLanguages = (json: JsonAvailableLanguagesType): Map<string, string> =>
  new Map(Object.keys(json).map(key => [key, normalizePath(json[key]!.path)]))

export default mapAvailableLanguages
