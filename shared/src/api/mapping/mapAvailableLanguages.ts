import normalizePath from '../../utils/normalizePath.ts'
import { JsonAvailableLanguagesType } from '../types.ts'

export const mapNewsAvailableLanguages = (json: Record<string, { id: number }>): Record<string, number> =>
  Object.entries(json).reduce((availableLanguages, [code, value]) => ({ ...availableLanguages, [code]: value.id }), {})

const mapAvailableLanguages = (json: JsonAvailableLanguagesType): Record<string, string> =>
  Object.entries(json).reduce(
    (availableLanguages, [code, value]) => ({ ...availableLanguages, [code]: normalizePath(value.path) }),
    {},
  )

export default mapAvailableLanguages
