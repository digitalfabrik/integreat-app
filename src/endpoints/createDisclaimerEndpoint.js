// @flow

import PageModel from '../models/PageModel'
import EndpointBuilder from '../EndpointBuilder'
import moment from 'moment'
import type { JsonDisclaimerType } from '../types'
import Endpoint from '../Endpoint'
import sanitizeHtml from 'sanitize-html-react'

const DISCLAIMER_ENDPOINT_NAME = 'disclaimer'

type ParamsType = { city: string, language: string }

export default (baseUrl: string): Endpoint<ParamsType, PageModel> => new EndpointBuilder(DISCLAIMER_ENDPOINT_NAME)
  .withParamsToUrlMapper((params: ParamsType): string =>
    `${baseUrl}/${params.city}/${params.language}/wp-json/extensions/v3/disclaimer`
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
      lastUpdate: moment(json.modified_gmt)
    })
  })
  .build()
