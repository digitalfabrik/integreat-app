// @flow

import { createAction } from 'redux-actions'
import LanguageModel from '../models/LanguageModel'
import { apiUrl } from '../constants'
import type { Dispatch } from 'redux-first-router/dist/flow-types'

type Params = {
  city: string,
  language: ?string
}

const LANGUAGES_FETCHED = 'LANGUAGES_FETCHED'
const LANGUAGE_NOT_FOUND = 'LANGUAGES_NOT_FOUND'

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
      dispatch(createAction(LANGUAGES_FETCHED)(languages))
      return languages
    })
    .then(languages => {
      if (params.language && !languages.find(_language => _language.code === params.language)) {
        dispatch(createAction(LANGUAGE_NOT_FOUND)({city: params.city, language: params.language}))
      }
      return languages
    })

export default fetcher
