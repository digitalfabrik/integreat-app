import { apiUrl } from '../constants'
import DisclaimerModel from '../models/DisclaimerModel'
import { isEmpty } from 'lodash/lang'

export const urlMapper = params => `${apiUrl}/${params.location}/${params.language}/wp-json/extensions/v0/modified_content/disclaimer?since=1970-01-01T00:00:00Z`

const mapper = json => {
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

const fetcher = async params =>
  fetch(urlMapper(params))
    .then(json => mapper(json))

export default fetcher
