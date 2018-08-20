// @flow

import { apiUrl } from '../constants'
import DisclaimerModel from '../models/DisclaimerModel'
import { isEmpty } from 'lodash/lang'
import EndpointBuilder from '../EndpointBuilder'
import ParamMissingError from '../errors/ParamMissingError'
import moment from 'moment'

const DISCLAIMER_ENDPOINT_NAME = 'disclaimer'

type JsonDisclaimerType = {
  id: number,
  title: string,
  content: string,
  modified_gmt: string
}

type ParamsType = { city: string, language: string }

export default new EndpointBuilder<ParamsType, DisclaimerModel>(DISCLAIMER_ENDPOINT_NAME)
  .withParamsToUrlMapper(params => {
    if (!params.city) {
      throw new ParamMissingError(DISCLAIMER_ENDPOINT_NAME, 'city')
    }
    if (!params.language) {
      throw new ParamMissingError(DISCLAIMER_ENDPOINT_NAME, 'language')
    }
    return `${apiUrl}/${params.city}/${params.language}/wp-json/extensions/v3/disclaimer`
  })
  .withMapper((json: JsonDisclaimerType) => {
    if (isEmpty(json)) {
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
