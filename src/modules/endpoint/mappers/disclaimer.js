import DisclaimerModel from '../models/DisclaimerModel'
import { isEmpty } from 'lodash/lang'

function disclaimerMapper (json) {
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

export default disclaimerMapper
