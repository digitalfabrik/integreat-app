import LanguageModel from '../models/LanguageModel'

function languagesMapper (json) {
  return json
    .map(language => new LanguageModel(language.code, language.native_name))
    .sort((lang1, lang2) => lang1.code.localeCompare(lang2.code))
}

export default languagesMapper
