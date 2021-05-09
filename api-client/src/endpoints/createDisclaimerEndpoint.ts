import PageModel from '../models/PageModel'
import EndpointBuilder from '../EndpointBuilder'
import moment from 'moment-timezone'
import { JsonDisclaimerType } from '../types'
import Endpoint from '../Endpoint'
import sanitizeHtml from 'sanitize-html-react'
import normalizePath from '../normalizePath'
import NotFoundError from '../errors/NotFoundError'
export const DISCLAIMER_ENDPOINT_NAME = 'disclaimer'
type ParamsType = {
  city: string
  language: string
}
export default (baseUrl: string): Endpoint<ParamsType, PageModel> =>
  new EndpointBuilder(DISCLAIMER_ENDPOINT_NAME)
    .withParamsToUrlMapper(
      (params: ParamsType): string => `${baseUrl}/${params.city}/${params.language}/wp-json/extensions/v3/disclaimer`
    )
    .withMapper(
      (json: JsonDisclaimerType | null | undefined, params: ParamsType): PageModel => {
        if (!json) {
          throw new NotFoundError({ ...params, type: 'disclaimer', id: '' })
        }

        return new PageModel({
          path: normalizePath(json.path),
          title: json.title,
          content: sanitizeHtml(json.content, {
            allowedSchemes: ['http', 'https', 'data', 'tel', 'mailto'],
            allowedTags: false,
            allowedAttributes: false
          }),
          lastUpdate: moment.tz(json.modified_gmt, 'GMT'),
          hash: json.hash
        })
      }
    )
    .build()
