import { useCallback } from 'react'

import {
  LoadSprungbrettJobReturn,
  OfferModel,
  SPRUNGBRETT_OFFER,
  loadSprungbrettJobs,
  useLoadAsync,
  ReturnType,
} from 'api-client'

import { determineApiUrl } from '../utils/helpers'

type EmbeddedOffers = {
  sprungbrett?: LoadSprungbrettJobReturn
}

type EmbeddedOffersParams = {
  embeddedOffers: OfferModel[]
  cityCode: string
  languageCode: string
}

export type EmbeddedOffersReturn = ReturnType<EmbeddedOffers>

const useLoadEmbeddedOffers = ({
  embeddedOffers,
  cityCode,
  languageCode,
}: EmbeddedOffersParams): EmbeddedOffersReturn => {
  const load = useCallback(async () => {
    if (embeddedOffers.length) {
      const embeddedOfferReturn = await Promise.all(
        embeddedOffers.map(async offer => {
          if (offer.alias === SPRUNGBRETT_OFFER) {
            return {
              sprungbrett: await loadSprungbrettJobs({ cityCode, languageCode, baseUrl: determineApiUrl }),
            }
          }
          return {}
        }),
      )
      return embeddedOfferReturn.reduce((it, acc) => ({ ...acc, ...it }), {})
    }
    return {}
  }, [cityCode, embeddedOffers, languageCode])

  return useLoadAsync(load)
}

export default useLoadEmbeddedOffers
