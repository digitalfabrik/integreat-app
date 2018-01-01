import { isEmpty } from 'lodash/lang'

import EndpointBuilder from '../EndpointBuilder'

import DisclaimerModel from '../models/DisclaimerModel'

export default new EndpointBuilder('disclaimer')
  .withUrl('https://cms.integreat-app.de/{location}/{language}/wp-json/extensions/v0/modified_content/disclaimer?since=1970-01-01T00:00:00Z')
  .withStateMapper().fromArray(['location', 'language'], (state, paramName) => state.router.params[paramName])
  .withMapper((json) => {
    if (isEmpty(json)) {
      throw new Error('disclaimer:notAvailable')
    }

    const disclaimers = json
      .filter((disclaimer) => disclaimer.status === 'publish')
      .map((disclaimer) => {
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
  })
  .build()
