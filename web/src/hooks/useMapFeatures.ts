import { useCallback, useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { GeoJsonPoi, isMultipoi, MapFeature } from 'shared'
import { PoiModel } from 'shared/api'

const multipoiKey = 'multipoi'

const useMapFeatures = (
  features: MapFeature[],
  pois: PoiModel[],
  slug?: string,
): {
  selectFeatureOnMap: (newFeatureOnMap: MapFeature | null) => void
  selectGeoJsonPoiInList: (newGeoJsonPoi: GeoJsonPoi | null) => void
  currentFeatureOnMap: MapFeature | null
  currentPoi: PoiModel | null
  poiListFeatures: GeoJsonPoi[]
} => {
  const geoJsonPois = useMemo(() => features.flatMap(feature => feature.properties.pois), [features])
  const currentPoi = useMemo(() => pois.find(poi => slug === poi.slug) ?? null, [pois, slug])
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const currentFeatureOnMap =
    useMemo(
      () =>
        searchParams.has(multipoiKey)
          ? features.find(feature => feature.id === searchParams.get(multipoiKey))
          : features.find(feature => feature.properties.pois.some(poi => poi.slug === slug)),
      [features, searchParams, slug],
    ) ?? null

  useEffect(() => {
    if (currentPoi && !currentFeatureOnMap?.properties.pois.some(poiFeature => poiFeature.slug === currentPoi.slug)) {
      // remove multipoi from search params if current poi is not part of this multipoi
      setSearchParams(new URLSearchParams())
    }
  }, [currentFeatureOnMap?.properties.pois, currentPoi, setSearchParams])

  const selectFeatureOnMap = useCallback(
    (newFeatureOnMap: MapFeature | null) => {
      if (!newFeatureOnMap) {
        navigate('.')
      } else if (isMultipoi(newFeatureOnMap)) {
        navigate(`.?${new URLSearchParams([[multipoiKey, newFeatureOnMap.id as string]])}`)
      } else {
        const newGeoJsonPoi = newFeatureOnMap.properties.pois[0]
        if (newGeoJsonPoi && currentFeatureOnMap?.properties.pois.includes(newGeoJsonPoi)) {
          navigate(`${newGeoJsonPoi.slug}?${searchParams}`)
        } else if (newGeoJsonPoi) {
          navigate(newGeoJsonPoi.slug)
        }
      }
    },
    [currentFeatureOnMap?.properties.pois, navigate, searchParams],
  )

  const selectGeoJsonPoiInList = useCallback(
    (newGeoJsonPoi: GeoJsonPoi | null) => {
      if (!newGeoJsonPoi) {
        if (currentFeatureOnMap && isMultipoi(currentFeatureOnMap) && currentPoi) {
          navigate(`.?${searchParams}`)
        } else {
          navigate('.')
        }
      } else {
        navigate(`${newGeoJsonPoi.slug}?${searchParams}`)
      }
    },
    [currentFeatureOnMap, currentPoi, navigate, searchParams],
  )

  const poiListFeatures = currentFeatureOnMap && !currentPoi ? currentFeatureOnMap.properties.pois : geoJsonPois
  return { selectFeatureOnMap, selectGeoJsonPoiInList, currentFeatureOnMap, currentPoi, poiListFeatures }
}

export default useMapFeatures
