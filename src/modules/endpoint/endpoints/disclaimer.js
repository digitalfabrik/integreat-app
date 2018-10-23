// @flow

import { apiUrl } from '../constants'
import BasePageModel from '../models/BasePageModel'
import EndpointBuilder from '../EndpointBuilder'
import moment from 'moment'
import type { JsonDisclaimerType } from '../types'

const DISCLAIMER_ENDPOINT_NAME = 'disclaimer'

type ParamsType = {city: string, language: string}

export default new EndpointBuilder<ParamsType, BasePageModel>(DISCLAIMER_ENDPOINT_NAME)
  .withParamsToUrlMapper((params: ParamsType): string =>
    `${apiUrl}/${params.city}/${params.language}/wp-json/extensions/v3/disclaimer`
  )
  .withMapper((json: ?JsonDisclaimerType): BasePageModel => {
    if (!json) {
      throw new Error('disclaimer:notAvailable')
    }

    return new BasePageModel({
      id: json.id,
      title: json.title,
      content: json.content,
      lastUpdate: moment(json.modified_gmt)
    })
  })
  .build()
