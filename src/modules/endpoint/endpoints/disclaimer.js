// @flow

import { apiUrl } from '../constants'
import DisclaimerModel from '../models/DisclaimerModel'
import { isEmpty } from 'lodash/lang'
import EndpointBuilder from '../EndpointBuilder'
import type { Params } from '../Endpoint'
import ParamMissingError from '../errors/ParamMissingError'

const DISCLAIMER_ENDPOINT_NAME = 'disclaimer'

export default new EndpointBuilder(DISCLAIMER_ENDPOINT_NAME)
  .withParamsToUrlMapper((params: Params): string => {
    if (!params.city) {
      throw new ParamMissingError(DISCLAIMER_ENDPOINT_NAME, 'city')
    }
    if (!params.language) {
      throw new ParamMissingError(DISCLAIMER_ENDPOINT_NAME, 'language')
    }
    return `${apiUrl}/${params.city}/${params.language}/wp-json/extensions/v0/modified_content/disclaimer?since=1970-01-01T00:00:00Z`
  })
  .withMapper((json: any): DisclaimerModel => {
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
  })
  .build()
