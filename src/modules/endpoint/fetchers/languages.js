// @flow

import LanguageModel from '../models/LanguageModel'
import { apiUrl } from '../constants'
import type { Dispatch } from 'redux-first-router/dist/flow-types'
import { saveLanguages } from '../actions/fetcher'
import { goToNotFound } from '../../app/routes/notFound'
import { redirect } from 'redux-first-router'

type Params = {
  city: string,
  language?: string
}

const urlMapper = (params: Params): string => `${apiUrl}/${params.city}/de/wp-json/extensions/v0/languages/wpml`

const fetcher = (dispatch: Dispatch, params: Params): Promise<Array<LanguageModel>> =>
  fetch(urlMapper(params))
    .then(result => result.json())
    .then(json => json
      .map(language => new LanguageModel(language.code, language.native_name))
      .sort((lang1, lang2) => lang1.code.localeCompare(lang2.code)))
    .then(languages => {
      dispatch(saveLanguages(languages))
      return languages
    })
    .then(languages => {
      // if the language param is not a valid language (for the current city) we want to show an error
      if (params.language && !languages.find(_language => _language.code === params.language)) {
        dispatch(redirect(goToNotFound(params.city, params.language)))
      }
      return languages
    })

export default fetcher
