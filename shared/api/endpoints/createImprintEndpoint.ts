import { DateTime } from 'luxon'

import Endpoint from '../Endpoint.js'
import EndpointBuilder from '../EndpointBuilder.js'
import { API_VERSION } from '../constants/index.js'
import NotFoundError from '../errors/NotFoundError.js'
import DocumentModel from '../models/DocumentModel.js'
import { JsonImprintType } from '../types.js'

export const IMPRINT_ENDPOINT_NAME = 'imprint'
type ParamsType = {
  region: string
  language: string
}
export default (baseUrl: string): Endpoint<ParamsType, DocumentModel> =>
  new EndpointBuilder<ParamsType, DocumentModel>(IMPRINT_ENDPOINT_NAME)
    .withParamsToUrlMapper(
      (params: ParamsType): string => `${baseUrl}/api/${API_VERSION}/${params.region}/${params.language}/imprint/`,
    )
    .withMapper((json: JsonImprintType | null | undefined, params: ParamsType): DocumentModel => {
      if (!json) {
        throw new NotFoundError({ ...params, type: 'imprint', id: '' })
      }

      return new DocumentModel({
        path: json.path,
        title: json.title,
        content: json.content,
        lastUpdate: DateTime.fromISO(json.last_updated),
      })
    })
    .build()
