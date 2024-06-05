import Endpoint from '../Endpoint'
import EndpointBuilder from '../EndpointBuilder'
import { API_VERSION } from '../constants'
import OfferModel from '../models/OfferModel'
import { JsonOfferPostType, JsonOfferType } from '../types'

export const OFFERS_ENDPOINT_NAME = 'offers'

export const createPostMap = (jsonPost: JsonOfferPostType): Map<string, string> => new Map(Object.entries(jsonPost))

type ParamsType = {
  city: string
  language: string
}
export default (baseUrl: string): Endpoint<ParamsType, Array<OfferModel>> =>
  new EndpointBuilder<ParamsType, Array<OfferModel>>(OFFERS_ENDPOINT_NAME)
    .withParamsToUrlMapper(params => `${baseUrl}/api/${API_VERSION}/${params.city}/${params.language}/offers/`)
    .withMapper((json: Array<JsonOfferType>) =>
      json.map(
        offer =>
          new OfferModel({
            alias: offer.alias,
            title: offer.name,
            path: offer.url,
            thumbnail: offer.thumbnail,
            postData: offer.post ? createPostMap(offer.post) : undefined,
          }),
      ),
    )
    .build()
