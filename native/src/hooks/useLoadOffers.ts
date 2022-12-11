import { createOffersEndpoint, OfferModel } from 'api-client'

import useLoadCityContent, { CityContentReturn } from './useLoadCityContent'

type UseLoadOffersProps = {
  cityCode: string
  languageCode: string
}

const useLoadOffers = (params: UseLoadOffersProps): CityContentReturn<{ offers: OfferModel[] }> =>
  useLoadCityContent({ ...params, createEndpoint: createOffersEndpoint, map: data => ({ offers: data }) })

export default useLoadOffers
