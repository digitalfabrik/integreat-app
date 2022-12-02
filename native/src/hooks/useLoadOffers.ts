import { useCallback } from 'react'

import { createOffersEndpoint, OfferModel } from 'api-client'

import { determineApiUrl } from '../utils/helpers'
import useLoadCityContent, { CityContentReturn } from './useLoadCityContent'

type UseLoadOffersProps = {
  cityCode: string
  languageCode: string
}

const useLoadOffers = ({ cityCode, languageCode }: UseLoadOffersProps): CityContentReturn<{ offers: OfferModel[] }> => {
  const load = useCallback(async () => {
    const payload = await createOffersEndpoint(await determineApiUrl()).request({
      city: cityCode,
      language: languageCode,
    })
    return payload.data ? { offers: payload.data } : null
  }, [cityCode, languageCode])

  return useLoadCityContent({ cityCode, languageCode, load })
}

export default useLoadOffers
