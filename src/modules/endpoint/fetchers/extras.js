// @flow

import { apiUrl } from '../constants'
import ExtraModel from '../models/ExtraModel'
import type { Dispatch } from 'redux-first-router/dist/flow-types'
import EndpointBuilder from '../EndpointBuilder'
import Payload from '../Payload'

type Params = {
  city: string,
  language: string
}

export default (dispatch: Dispatch, oldPayload: Payload, params: Params): Promise<Payload> => new EndpointBuilder('extras')
  .withParamsToUrlMapper((params: Params): string => `${apiUrl}/${params.city}/${params.language}/wp-json/extensions/v3/extras`)
  .withMapper((json: any): Array<ExtraModel> => json
    .map(extra => new ExtraModel({
      alias: extra.alias,
      name: extra.name,
      path: extra.url,
      thumbnail: extra.thumbnail
    })))
  .build()
  .fetchData(dispatch, oldPayload, params)
