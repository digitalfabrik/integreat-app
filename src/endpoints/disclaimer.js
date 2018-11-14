// @flow

import { apiUrl } from '../constants'
import PageModel from '../models/PageModel'
import EndpointBuilder from '../EndpointBuilder'
import moment from 'moment'
import type { JsonDisclaimerType } from '../types'
import Endpoint from '../Endpoint'

const DISCLAIMER_ENDPOINT_NAME = 'disclaimer'

type ParamsType = {city: string, language: string}

const endpoint: Endpoint<ParamsType, PageModel> = new EndpointBuilder(DISCLAIMER_ENDPOINT_NAME)
  .withParamsToUrlMapper((params: ParamsType): string =>
    `${apiUrl}/${params.city}/${params.language}/wp-json/extensions/v3/disclaimer`
  )
  .withMapper((json: ?JsonDisclaimerType): PageModel => {
    if (!json) {
      throw new Error('disclaimer:notAvailable')
    }

    return new PageModel({
      id: json.id,
      title: json.title,
      content: json.content,
      lastUpdate: moment(json.modified_gmt)
    })
  })
  .build()

export default endpoint
