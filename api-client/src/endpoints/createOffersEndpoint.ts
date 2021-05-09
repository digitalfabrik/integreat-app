import OfferModel from '../models/OfferModel'
import EndpointBuilder from '../EndpointBuilder'
import type { JsonOfferPostType, JsonOfferType } from '../types'
import Endpoint from '../Endpoint'
export const OFFERS_ENDPOINT_NAME = 'offers'

const createPostMap = (jsonPost: JsonOfferPostType): Map<string, string> => {
  const map = new Map()
  Object.keys(jsonPost).forEach(key => map.set(key, jsonPost[key]))
  return map
}

type ParamsType = {
  city: string
  language: string
}
export default (baseUrl: string): Endpoint<ParamsType, Array<OfferModel>> =>
  new EndpointBuilder(OFFERS_ENDPOINT_NAME)
    .withParamsToUrlMapper(params => {
      return `${baseUrl}/${params.city}/${params.language}/wp-json/extensions/v3/extras`
    })
    .withMapper((json: Array<JsonOfferType>) =>
      json.map(
        offer =>
          new OfferModel({
            alias: offer.alias,
            title: offer.name,
            path: offer.url,
            thumbnail: offer.thumbnail,
            postData: offer.post ? createPostMap(offer.post) : null
          })
      )
    )
    .build()