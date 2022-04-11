import distance from '@turf/distance'

import { LocationType, PoiModel } from '../index'
import { PoiFeature, PoiFeatureCollection } from '../maps'

export type FeatureLocationsType = { features: PoiFeature[]; pois: PoiModel[] }

export const embedInCollection = (features: PoiFeature[]): PoiFeatureCollection => ({
  type: 'FeatureCollection',
  features
})

export const prepareFeatureLocation = (poi: PoiModel, userLocation: LocationType | null): PoiFeature | null => {
  const { featureLocation } = poi
  if (userLocation && featureLocation) {
    const distanceValue = distance(userLocation, featureLocation.geometry.coordinates).toFixed(1)
    return { ...featureLocation, properties: { ...featureLocation.properties, distance: distanceValue } }
  }
  return featureLocation
}

// Calculate distance for all Feature Locations
export const prepareFeatureLocations = (
  pois: Array<PoiModel>,
  userLocation: LocationType | null
): FeatureLocationsType => {
  const features = pois
    .map(poi => prepareFeatureLocation(poi, userLocation))
    .filter((feature): feature is PoiFeature => !!feature)
    .sort((poi1: PoiFeature, poi2: PoiFeature) => poi1.properties.title.localeCompare(poi2.properties.title))

  return { features, pois }
}
