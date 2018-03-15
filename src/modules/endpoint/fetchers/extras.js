// @flow

import { apiUrl } from '../constants'
import ExtraModel from '../models/ExtraModel'

type Params = {
  city: string,
  language: string
}

type Dispatch = ({type: string, payload: Array<ExtraModel>}) => {}

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
      dispatch({type: 'EXTRAS_FETCHED', payload: extras})
      return extras
    })

export default fetcher
