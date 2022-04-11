import { useCallback } from 'react'

import {
  createPOIsEndpoint,
  Payload,
  PoiFeature,
  PoiModel,
  prepareFeatureLocations,
  ReturnType,
  useLoadFromEndpoint
} from 'api-client'

import { cmsApiBaseUrl } from '../constants/urls'
import getUserLocation from '../utils/getUserLocation'

type FeatureLocationsType = { features: PoiFeature[]; pois: PoiModel[] }

const useFeatureLocations = (cityCode: string, languageCode: string): ReturnType<FeatureLocationsType> => {
  const requestFeatureLocations = useCallback(async () => {
    const { coordinates } = await getUserLocation()
    const { data, error } = await createPOIsEndpoint(cmsApiBaseUrl).request({ city: cityCode, language: languageCode })

    if (data) {
      return new Payload(false, null, { pois: data, features: prepareFeatureLocations(data, coordinates) })
    }

    throw error
  }, [cityCode, languageCode])
  return useLoadFromEndpoint(requestFeatureLocations)
}

export default useFeatureLocations
