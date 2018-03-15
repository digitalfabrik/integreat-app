// @flow

import { createAction } from 'redux-actions'
import { apiUrl } from '../constants'
import ExtraModel from '../models/ExtraModel'
import type { Dispatch } from 'redux-first-router/dist/flow-types'

type Params = {
  city: string,
  language: string
}

export const EXTRAS_FETCHED = 'EXTRAS_FETCHED'

const urlMapper = (params: Params): string => `${apiUrl}/${params.city}/${params.language}/wp-json/extensions/v3/extras`

const mapper = (json: any): Array<ExtraModel> =>
  json
    .map(extra => new ExtraModel({
      alias: extra.alias,
      name: extra.name,
      path: extra.url,
      thumbnail: extra.thumbnail
    }))

const fetcher = (dispatch: Dispatch, params: Params): Promise<Array<ExtraModel>> =>
  fetch(urlMapper(params))
    .then(result => result.json())
    .then(json => mapper(json))
    .then(extras => {
      dispatch(createAction(EXTRAS_FETCHED)(extras))
      return extras
    })

export default fetcher
