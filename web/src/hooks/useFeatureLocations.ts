import { useCallback } from 'react'

import {
  createPOIsEndpoint,
  Payload,
  PoiFeature,
  prepareFeatureLocations,
  ReturnType,
  useLoadFromEndpoint
} from 'api-client'

import { cmsApiBaseUrl } from '../constants/urls'
import getUserLocation from '../utils/getUserLocation'

export const useFeatureLocations = (cityCode: string, languageCode: string): ReturnType<PoiFeature[]> => {
  const requestFeatureLocations = useCallback(async () => {
    const userLocation = await getUserLocation()
    const { data, error } = await createPOIsEndpoint(cmsApiBaseUrl).request({ city: cityCode, language: languageCode })

    if (data) {
      const coordinates = userLocation.status === 'ready' ? userLocation.coordinates : null
      return new Payload(false, null, prepareFeatureLocations(data, coordinates))
    }

    throw error
  }, [cityCode, languageCode])
  return useLoadFromEndpoint(requestFeatureLocations)
}
