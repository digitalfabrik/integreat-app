import { useCallback } from 'react'

import {
  CategoryModel,
  LoadSprungbrettJobReturn,
  ReturnType,
  SPRUNGBRETT_OFFER,
  loadSprungbrettJobs,
  useLoadAsync,
  MALTE_HELP_FORM_OFFER_ROUTE,
} from 'api-client'

import { determineApiUrl } from '../utils/helpers'

type EmbeddedOffers = {
  sprungbrett?: LoadSprungbrettJobReturn
  help?: true
}

export type EmbeddedOffersParams = {
  category?: CategoryModel | null
  cityCode: string
  languageCode: string
}

export type EmbeddedOffersReturn = ReturnType<EmbeddedOffers>

export const useLoadEmbeddedOffers = ({
  category,
  cityCode,
  languageCode,
}: EmbeddedOffersParams): EmbeddedOffersReturn => {
  const load = useCallback(async () => {
    if (!category?.embeddedOffers.length) {
      return {}
    }
    return category.embeddedOffers.reduce(async (accumulator, offer) => {
      if (offer.alias === SPRUNGBRETT_OFFER) {
        return {
          ...accumulator,
          [SPRUNGBRETT_OFFER]: await loadSprungbrettJobs({ cityCode, languageCode, baseUrl: await determineApiUrl() }),
        }
      }
      if (offer.alias === MALTE_HELP_FORM_OFFER_ROUTE) {
        return {
          ...accumulator,
          [MALTE_HELP_FORM_OFFER_ROUTE]: true,
        }
      }
      return { ...accumulator }
    }, Promise.resolve({}))
  }, [cityCode, category, languageCode])

  return useLoadAsync(load)
}

export default useLoadEmbeddedOffers
