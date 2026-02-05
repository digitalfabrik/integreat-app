import { LanguageModel } from 'shared/api'
import { config } from 'translations'

const supportedLanguages: LanguageModel[] = Object.entries(config.supportedLanguages)
  .map(([code, language]) => new LanguageModel(code, language.name))
  .sort((a, b) => a.code.localeCompare(b.code))

export default supportedLanguages
