import { useCallback, useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { MapPoi, isMultipoi, MapFeature, PoiModel } from 'api-client'

const multipoiKey = 'multipoi'

const useMapFeatures = (
  features: MapFeature[],
  pois: PoiModel[],
  slug?: string
): {
  selectFeatureOnMap: (newFeatureOnMap: MapFeature | null) => void
  selectPoiInList: (newMapPoi: MapPoi | null) => void
  currentFeatureOnMap: MapFeature | null
  currentPoi: PoiModel | null
  poiListFeatures: MapPoi[]
} => {
  const mapPois = useMemo(() => features.flatMap(feature => feature.properties.pois), [features])
  const currentPoi = useMemo(() => pois.find(poi => slug === poi.slug) ?? null, [pois, slug])
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const currentFeatureOnMap =
    useMemo(
      () =>
        searchParams.has(multipoiKey)
          ? features.find(feature => feature.id === searchParams.get(multipoiKey))
          : features.find(feature => feature.properties.pois.some(poi => poi.slug === slug)),
      [features, searchParams, slug]
    ) ?? null

  useEffect(() => {
    if (currentPoi && !currentFeatureOnMap?.properties.pois.some(poiFeature => poiFeature.slug === currentPoi.slug)) {
      // remove multipoi from search params if current poi is not part of this multipoi
      setSearchParams(new URLSearchParams())
    }
  }, [currentFeatureOnMap?.properties.pois, currentPoi, setSearchParams])

  const selectFeatureOnMap = useCallback(
    (newMapFeature: MapFeature | null) => {
      if (!newMapFeature) {
        navigate('.')
      } else if (isMultipoi(newMapFeature)) {
        navigate(`.?${new URLSearchParams([[multipoiKey, newMapFeature.id as string]])}`)
      } else {
        const newPoiFeature = newMapFeature.properties.pois[0]
        if (newPoiFeature && currentFeatureOnMap?.properties.pois.includes(newPoiFeature)) {
          navigate(`${newPoiFeature.slug}?${searchParams}`)
        } else if (newPoiFeature) {
          navigate(newPoiFeature.slug)
        }
      }
    },
    [currentFeatureOnMap?.properties.pois, navigate, searchParams]
  )

  const selectPoiInList = useCallback(
    (newMapPoi: MapPoi | null) => {
      if (!newMapPoi) {
        if (currentFeatureOnMap && isMultipoi(currentFeatureOnMap) && currentPoi) {
          navigate(`.?${searchParams}`)
        } else {
          navigate('.')
        }
      } else {
        navigate(`${newMapPoi.slug}?${searchParams}`)
      }
    },
    [currentFeatureOnMap, currentPoi, navigate, searchParams]
  )

  const poiListFeatures = currentFeatureOnMap && !currentPoi ? currentFeatureOnMap.properties.pois : mapPois
  return { selectFeatureOnMap, selectPoiInList, currentFeatureOnMap, currentPoi, poiListFeatures }
}

export default useMapFeatures
