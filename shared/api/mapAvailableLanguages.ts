import normalizePath from '../utils/normalizePath'
import { JsonAvailableLanguagesType } from './types'

const mapAvailableLanguages = (json: JsonAvailableLanguagesType): Map<string, string> =>
  // We are mapping over the keys (i.e. languages), so there is always a json[language]
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  new Map(Object.keys(json).map(language => [language, normalizePath(json[language]!.path)]))

export default mapAvailableLanguages
