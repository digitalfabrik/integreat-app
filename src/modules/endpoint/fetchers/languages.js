// @flow

import LanguageModel from '../models/LanguageModel'
import { apiUrl } from '../constants'

type Params = {
  city: string,
  language: ?string
}

type Dispatch = ({type: string, payload: Array<LanguageModel> | {city: string, language: string}}) => {}

const urlMapper = (params: Params): string => `${apiUrl}/${params.city}/de/wp-json/extensions/v0/languages/wpml`

const mapper = (json: any): Array<LanguageModel> =>
  json
    .map(language => new LanguageModel(language.code, language.native_name))
    .sort((lang1, lang2) => lang1.code.localeCompare(lang2.code))

const fetcher = (dispatch: Dispatch, params: Params): Promise<Array<LanguageModel>> =>
  fetch(urlMapper(params))
    .then(result => result.json())
    .then(json => mapper(json))
    .then(languages => {
      dispatch({type: 'LANGUAGES_FETCHED', payload: languages})
      return languages
    })
    .then(languages => {
      if (params.language && !languages.find(_language => _language.code === params.language)) {
        dispatch({type: 'LANGUAGE_NOT_FOUND', payload: {city: params.city, language: params.language}})
      }
      return languages
    })

export default fetcher
