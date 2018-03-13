import LanguageModel from '../models/LanguageModel'
import { apiUrl } from '../constants'

const urlMapper = params => `${apiUrl}/${params.location}/de/wp-json/extensions/v0/languages/wpml`

const mapper = json =>
  json
    .map(language => new LanguageModel(language.code, language.native_name))
    .sort((lang1, lang2) => lang1.code.localeCompare(lang2.code))

const fetcher = (params, dispatch, language) =>
  fetch(urlMapper(params))
    .then(result => result.json())
    .then(json => mapper(json))
    .then(languages => {
      dispatch({type: 'LANGUAGES_FETCHED', payload: languages})
      return languages
    })
    .then(languages => {
      if (language && !languages.find(_language => _language.code === language)) {
        dispatch({type: 'LANGUAGE_NOT_FOUND', payload: {location, language}})
      }
    })

export default fetcher
