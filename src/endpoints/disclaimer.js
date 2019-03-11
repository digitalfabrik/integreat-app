// @flow

import { apiUrl } from '../constants'
import PageModel from '../models/PageModel'
import EndpointBuilder from '../EndpointBuilder'
import moment from 'moment-timezone'
import type { JsonDisclaimerType } from '../types'
import Endpoint from '../Endpoint'
import sanitizeHtml from 'sanitize-html-react'

const DISCLAIMER_ENDPOINT_NAME = 'disclaimer'

type ParamsType = { city: string, language: string }

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
      content: sanitizeHtml(json.content, {
        allowedSchemes: ['http', 'https', 'data', 'tel', 'mailto'],
        allowedTags: false,
        allowedAttributes: false
      }),
      lastUpdate: moment.tz(json.modified_gmt, 'GMT')
    })
  })
  .build()

export default endpoint
