import { useCallback } from 'react'

import { createPOIsEndpoint, PoiModel } from 'api-client'

import { dataContainer } from '../utils/DefaultDataContainer'
import { determineApiUrl } from '../utils/helpers'
import useLoadCityContent, { CityContentReturn } from './useLoadCityContent'

type UseLoadPoisProps = {
  cityCode: string
  languageCode: string
}

const useLoadPois = ({ cityCode, languageCode }: UseLoadPoisProps): CityContentReturn<{ pois: PoiModel[] }> => {
  const load = useCallback(async () => {
    if (await dataContainer.poisAvailable(cityCode, languageCode)) {
      return { pois: await dataContainer.getPois(cityCode, languageCode) }
    }

    const payload = await createPOIsEndpoint(await determineApiUrl()).request({
      city: cityCode,
      language: languageCode,
    })
    if (payload.data) {
      await dataContainer.setPois(cityCode, languageCode, payload.data)
    }
    return payload.data ? { pois: payload.data } : null
  }, [cityCode, languageCode])

  return useLoadCityContent({ cityCode, languageCode, load })
}

export default useLoadPois
