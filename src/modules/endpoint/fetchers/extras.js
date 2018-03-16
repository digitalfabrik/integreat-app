// @flow

import { apiUrl } from '../constants'
import ExtraModel from '../models/ExtraModel'
import type { Dispatch } from 'redux-first-router/dist/flow-types'
import { saveExtras } from '../actions/fetcher'

type Params = {
  city: string,
  language: string
}

const urlMapper = (params: Params): string => `${apiUrl}/${params.city}/${params.language}/wp-json/extensions/v3/extras`

const fetcher = (dispatch: Dispatch, params: Params): Promise<Array<ExtraModel>> =>
  fetch(urlMapper(params))
    .then(result => result.json())
    .then(json => json
      .map(extra => new ExtraModel({
        alias: extra.alias,
        name: extra.name,
        path: extra.url,
        thumbnail: extra.thumbnail
      })))
    .then(extras => {
      dispatch(saveExtras(extras))
      return extras
    })

export default fetcher
