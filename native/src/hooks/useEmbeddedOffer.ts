import { useCallback } from 'react'

import {
  CategoryModel,
  ErrorCode,
  LoadSprungbrettJobReturn,
  SPRUNGBRETT_OFFER,
  loadSprungbrettJobs,
  useLoadAsync,
} from 'api-client'

import { determineApiUrl } from '../utils/helpers'
import { CityContentReturn } from './useLoadCityContent'

type EmbeddedOfferParams = {
  cityContentResponse: Omit<CityContentReturn, 'data'>
  category?: CategoryModel | null
  cityCode: string
  languageCode: string
}

type EmbeddedOfferReturn = {
  extra: Awaited<LoadSprungbrettJobReturn> | null
  error: Error | ErrorCode | null
  loading: boolean
  refresh: () => void
}

const useEmbeddedOffer = ({
  category,
  cityCode,
  languageCode,
  cityContentResponse,
}: EmbeddedOfferParams): EmbeddedOfferReturn => {
  const load = useCallback(async () => {
    if (category) {
      const embeddedOfferReturn = await Promise.all(
        category.embeddedOffers.flatMap(offer => {
          if (offer.alias === SPRUNGBRETT_OFFER) {
            return loadSprungbrettJobs({ cityCode, languageCode, baseUrl: determineApiUrl })
          }
          return []
        }),
      )
      return Object.assign({}, ...embeddedOfferReturn)
    }
    return null
  }, [category, cityCode, languageCode])

  const { data: extra, ...extraResponse } = useLoadAsync(load)

  const refresh = useCallback(() => {
    cityContentResponse.refresh()
    extraResponse.refresh()
  }, [cityContentResponse, extraResponse])

  return {
    extra,
    refresh,
    error: cityContentResponse.error ?? extraResponse.error,
    loading: cityContentResponse.loading || extraResponse.loading,
  }
}

export default useEmbeddedOffer
