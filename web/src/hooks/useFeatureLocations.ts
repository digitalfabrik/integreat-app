import { useCallback } from 'react'

import { createPOIsEndpoint, LocationType, PoiFeature, PoiModel, prepareFeatureLocations, ReturnType, useLoadAsync } from 'api-client'

import { cmsApiBaseUrl } from '../constants/urls'

type FeatureLocationsType = { features: PoiFeature[]; pois: PoiModel[] }

const useFeatureLocations = (cityCode: string, languageCode: string, coordinates?: LocationType): ReturnType<FeatureLocationsType> => {
  const requestFeatureLocations = useCallback(async () => {
    const { data, error } = await createPOIsEndpoint(cmsApiBaseUrl).request({ city: cityCode, language: languageCode })

    if (data) {
      return { pois: data, features: prepareFeatureLocations(data, coordinates) }
    }

    throw error
  }, [cityCode, languageCode, coordinates])
  return useLoadAsync(requestFeatureLocations)
}

export default useFeatureLocations
