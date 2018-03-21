// @flow

import LanguageModel from '../models/LanguageModel'
import { apiUrl } from '../constants'
import type { Dispatch } from 'redux-first-router/dist/flow-types'
import EndpointBuilder from '../EndpointBuilder'
import Payload from '../Payload'

type Params = {
  city: string
}

export default (dispatch: Dispatch, oldPayload: Payload, params: Params): Promise<Payload> => new EndpointBuilder('languages')
  .withParamsToUrlMapper((params: Params): string => `${apiUrl}/${params.city}/de/wp-json/extensions/v0/languages/wpml`)
  .withMapper((json: any): Array<LanguageModel> => json
    .map(language => new LanguageModel(language.code, language.native_name))
    .sort((lang1, lang2) => lang1.code.localeCompare(lang2.code))
  )
  .build()
  .fetchData(dispatch, oldPayload, params)
