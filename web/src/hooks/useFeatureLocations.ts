import { useCallback, useEffect, useState } from 'react'

import { createPOIsEndpoint, PoiFeature, PoiModel, prepareFeatureLocations, useLoadFromEndpoint } from 'api-client/src'

import { cmsApiBaseUrl } from '../constants/urls'
import { useUserLocation } from './useUserLocation'

type UseFeatureLocations = {
  featureLocations: PoiFeature[]
  loading: boolean
  poisError: Error | null
  pois: PoiModel[] | null
}

export const useFeatureLocations = (cityCode: string, languageCode: string): UseFeatureLocations => {
  const [featureLocations, setFeatureLocations] = useState<PoiFeature[]>([])
  const { locationState, userCoordinates } = useUserLocation()
  const requestPois = useCallback(
    async () => createPOIsEndpoint(cmsApiBaseUrl).request({ city: cityCode, language: languageCode }),
    [cityCode, languageCode]
  )
  const { data: pois, loading, error: poisError } = useLoadFromEndpoint(requestPois)

  useEffect(() => {
    if (pois && locationState.message !== 'loading') {
      setFeatureLocations(prepareFeatureLocations(pois, userCoordinates))
    }
  }, [pois, locationState.message])

  return { featureLocations, loading, poisError, pois }
}
