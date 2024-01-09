import { useCallback } from 'react'

import {
  CategoryModel,
  LoadSprungbrettJobReturn,
  SPRUNGBRETT_OFFER,
  loadSprungbrettJobs,
  useLoadAsync,
} from 'api-client'

import { determineApiUrl } from '../utils/helpers'

type EmbeddedOffers = {
  sprungbrett?: Awaited<LoadSprungbrettJobReturn>
}

type EmbeddedOffersParams = {
  category?: CategoryModel | null
  cityCode: string
  languageCode: string
}

export type EmbeddedOffersReturn = {
  embeddedOffers: EmbeddedOffers | null
  error: Error | null
  loading: boolean
  refresh: () => void
}

const useEmbeddedOffers = ({ category, cityCode, languageCode }: EmbeddedOffersParams): EmbeddedOffersReturn => {
  const load = useCallback(async () => {
    if (category) {
      const embeddedOfferReturn = await Promise.all(
        category.embeddedOffers.map(async offer => {
          if (offer.alias === SPRUNGBRETT_OFFER) {
            return {
              sprungbrett: await loadSprungbrettJobs({ cityCode, languageCode, baseUrl: determineApiUrl }),
            }
          }
          return {}
        }),
      )
      return Object.assign({}, ...embeddedOfferReturn) as EmbeddedOffers
    }
    return {} as EmbeddedOffers
  }, [category, cityCode, languageCode])

  const { data: embeddedOffers, ...extraResponse } = useLoadAsync(load)

  return {
    embeddedOffers,
    ...extraResponse,
  }
}

export default useEmbeddedOffers
