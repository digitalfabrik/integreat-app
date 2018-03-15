// @flow

import { apiUrl } from '../constants'
import DisclaimerModel from '../models/DisclaimerModel'
import { isEmpty } from 'lodash/lang'

type Params = {
  city: string,
  language: string
}

type Dispatch = ({type: string, payload: DisclaimerModel}) => {}

export const urlMapper = (params: Params): string => `${apiUrl}/${params.city}/${params.language}/wp-json/extensions/v0/modified_content/disclaimer?since=1970-01-01T00:00:00Z`

const mapper = (json: any): DisclaimerModel => {
  if (isEmpty(json)) {
    throw new Error('disclaimer:notAvailable')
  }

  const disclaimers = json
    .filter(disclaimer => disclaimer.status === 'publish')
    .map(disclaimer => {
      return new DisclaimerModel({
        id: disclaimer.id,
        title: disclaimer.title,
        content: disclaimer.content
      })
    })

  if (disclaimers.length !== 1) {
    throw new Error('There must be exactly one disclaimer!')
  }

  return disclaimers[0]
}

const fetcher = (dispatch: Dispatch, params: Params): Promise<DisclaimerModel> =>
  fetch(urlMapper(params))
    .then(response => response.json())
    .then(json => mapper(json))
    .then(disclaimer => {
      dispatch({type: 'DISCLAIMER_FETCHED', payload: disclaimer})
      return disclaimer
    })

export default fetcher
