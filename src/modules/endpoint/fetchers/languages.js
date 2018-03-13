import LanguageModel from '../models/LanguageModel'
import { apiUrl } from '../constants'

const urlMapper = params => `${apiUrl}/${params.location}/de/wp-json/extensions/v0/languages/wpml`

const mapper = json =>
  json
    .map(language => new LanguageModel(language.code, language.native_name))
    .sort((lang1, lang2) => lang1.code.localeCompare(lang2.code))

const fetcher = async params =>
  fetch(urlMapper(params))
    .then(json => mapper(json))

export default fetcher
