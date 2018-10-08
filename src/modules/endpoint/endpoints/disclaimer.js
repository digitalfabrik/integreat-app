// @flow

import { apiUrl } from '../constants'
import DisclaimerModel from '../models/DisclaimerModel'
import EndpointBuilder from '../EndpointBuilder'
import moment from 'moment'
import type { JsonDisclaimerType } from '../types'

const DISCLAIMER_ENDPOINT_NAME = 'disclaimer'

type ParamsType = {city: string, language: string}

export default new EndpointBuilder<ParamsType, DisclaimerModel>(DISCLAIMER_ENDPOINT_NAME)
  .withParamsToUrlMapper((params: ParamsType): string =>
    `${apiUrl}/${params.city}/${params.language}/wp-json/extensions/v3/disclaimer`
  )
  .withMapper((json: ?JsonDisclaimerType): DisclaimerModel => {
    if (!json) {
      throw new Error('disclaimer:notAvailable')
    }

    return new DisclaimerModel({
      id: json.id,
      title: json.title,
      content: json.content,
      lastUpdate: moment(json.modified_gmt)
    })
  })
  .build()
