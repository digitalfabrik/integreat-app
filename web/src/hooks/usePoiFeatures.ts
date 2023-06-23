import { Map } from 'maplibre-gl'
import { useCallback, useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { GeoJsonPoi, isMultipoi, PoiFeature, PoiModel } from 'api-client'

const multipoiKey = 'multipoi'

const usePoiFeatures = (
  features: PoiFeature[],
  pois: PoiModel[],
  slug?: string,
  mapRef?: Map
): {
  selectFeatureOnMap: (newFeatureOnMap: PoiFeature | null) => void
  selectPoiFeatureInList: (newPoiFeature: GeoJsonPoi | null) => void
  currentFeatureOnMap: PoiFeature | null
  currentPoi: PoiModel | null
  poiListFeatures: GeoJsonPoi[]
} => {
  const poiFeatures = useMemo(() => features.flatMap(feature => feature.properties.pois), [features])
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

  const deselectFeature = useCallback(() => {
    if (currentFeatureOnMap && isMultipoi(currentFeatureOnMap) && currentPoi) {
      navigate(`.?${searchParams}`)
    } else {
      navigate('.')
    }
  }, [currentFeatureOnMap, currentPoi, navigate, searchParams])

  const selectFeatureOnMap = useCallback(
    (newFeatureOnMap: PoiFeature | null) => {
      if (mapRef?.isMoving()) {
        mapRef.stop()
      }
      if (!newFeatureOnMap) {
        deselectFeature()
      } else if (isMultipoi(newFeatureOnMap)) {
        navigate(`.?${new URLSearchParams([[multipoiKey, newFeatureOnMap.id as string]])}`)
      } else {
        const newPoiFeature = newFeatureOnMap.properties.pois[0]
        if (newPoiFeature && currentFeatureOnMap?.properties.pois.includes(newPoiFeature)) {
          navigate(`${newPoiFeature.slug}?${searchParams}`)
        } else if (newPoiFeature) {
          navigate(newPoiFeature.slug)
        }
      }
    },
    [currentFeatureOnMap?.properties.pois, deselectFeature, mapRef, navigate, searchParams]
  )

  const selectPoiFeatureInList = useCallback(
    (newPoiFeature: GeoJsonPoi | null) => {
      if (mapRef?.isMoving()) {
        mapRef.stop()
      }
      if (!newPoiFeature) {
        deselectFeature()
      } else {
        navigate(`${newPoiFeature.slug}?${searchParams}`)
      }
    },
    [deselectFeature, mapRef, navigate, searchParams]
  )

  const poiListFeatures = currentFeatureOnMap && !currentPoi ? currentFeatureOnMap.properties.pois : poiFeatures
  return { selectFeatureOnMap, selectPoiFeatureInList, currentFeatureOnMap, currentPoi, poiListFeatures }
}

export default usePoiFeatures
