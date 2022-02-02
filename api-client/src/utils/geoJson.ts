import distance from '@turf/distance'

import { LocationType, PoiModel } from '../index'
import { PoiFeature, PoiFeatureCollection } from '../maps'

export const embedInCollection = (features: PoiFeature[]): PoiFeatureCollection => ({
  type: 'FeatureCollection',
  features
})

// Calculate distance for all Feature Locations
export const prepareFeatureLocations = (pois: Array<PoiModel>, userLocation?: LocationType | null): PoiFeature[] =>
  pois
    .map(poi => {
      const { featureLocation } = poi
      if (userLocation && featureLocation?.geometry.coordinates) {
        const distanceValue: string = distance(userLocation, featureLocation.geometry.coordinates).toFixed(1)
        return { ...featureLocation, properties: { ...featureLocation.properties, distance: distanceValue } }
      }
      return poi.featureLocation
    })
    .filter((feature): feature is PoiFeature => !!feature)
