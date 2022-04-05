import distance from '@turf/distance'

import { LocationType, PoiModel } from '../index'
import { PoiFeature, PoiFeatureCollection } from '../maps'

export const embedInCollection = (features: PoiFeature[]): PoiFeatureCollection => ({
  type: 'FeatureCollection',
  features
})

export const prepareFeatureLocation = (poi: PoiModel, userLocation: LocationType | null): PoiFeature | null => {
  const { featureLocation } = poi
  if (userLocation && featureLocation?.geometry.coordinates) {
    const distanceValue: string = distance(userLocation, featureLocation.geometry.coordinates).toFixed(1)
    return { ...featureLocation, properties: { ...featureLocation.properties, distance: distanceValue } }
  }
  return featureLocation
}

// Calculate distance for all Feature Locations
export const prepareFeatureLocations = (pois: Array<PoiModel>, userLocation: LocationType | null): PoiFeature[] =>
  pois
    .map(poi => prepareFeatureLocation(poi, userLocation))
    .filter((feature): feature is PoiFeature => !!feature)
    .sort((poi1: PoiFeature, poi2: PoiFeature) => poi1.properties.title.localeCompare(poi2.properties.title))
