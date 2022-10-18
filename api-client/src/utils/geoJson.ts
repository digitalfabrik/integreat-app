import distance from '@turf/distance'

import { LocationType, PoiModel } from '../index'
import { PoiFeature, PoiFeatureCollection } from '../maps'

export const embedInCollection = (features: PoiFeature[]): PoiFeatureCollection => ({
  type: 'FeatureCollection',
  features,
})

export const prepareFeatureLocation = (poi: PoiModel, userLocation: LocationType | null): PoiFeature => {
  const { featureLocation } = poi
  if (userLocation) {
    const distanceValue = distance(userLocation, featureLocation.geometry.coordinates).toFixed(1)
    return { ...featureLocation, properties: { ...featureLocation.properties, distance: distanceValue } }
  }
  return featureLocation
}

export const prepareFeatureLocations = (pois: Array<PoiModel>, userLocation: LocationType | null): PoiFeature[] => {
  const poiFeatures = pois.map(poi => prepareFeatureLocation(poi, userLocation))

  if (userLocation) {
    return poiFeatures.sort(
      (poi1, poi2) => parseFloat(poi1.properties.distance ?? '0') - parseFloat(poi2.properties.distance ?? '0')
    )
  }
  return poiFeatures.sort((poi1, poi2) => poi1.properties.title.localeCompare(poi2.properties.title))
}
