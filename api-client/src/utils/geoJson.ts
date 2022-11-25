import distance from '@turf/distance'
import { Position } from 'geojson'

import { LocationType, PoiModel } from '../index'
import { PoiFeature, PoiFeatureCollection } from '../maps'

export const embedInCollection = (features: PoiFeature[]): PoiFeatureCollection => ({
  type: 'FeatureCollection',
  features,
})

export const prepareFeatureLocation = (
  poi: PoiModel,
  userLocation: LocationType | null,
  coordinateList: Position[]
): PoiFeature => {
  const { featureLocation } = poi
  const { coordinates } = featureLocation.geometry

  // 50 meters
  const maxDistanceForOverlap = 0.05
  const overlappingCoordinates = coordinateList.filter(coord => distance(coord, coordinates) < maxDistanceForOverlap)
  featureLocation.properties.closeToOtherPoi = overlappingCoordinates.length > 1

  if (userLocation) {
    const distanceValue = distance(userLocation, featureLocation.geometry.coordinates).toFixed(1)
    return { ...featureLocation, properties: { ...featureLocation.properties, distance: distanceValue } }
  }
  return featureLocation
}

export const prepareFeatureLocations = (pois: Array<PoiModel>, userLocation: LocationType | null): PoiFeature[] => {
  const coordinateList = pois.map(poi => poi.featureLocation.geometry.coordinates)
  const poiFeatures = pois.map(poi => prepareFeatureLocation(poi, userLocation, coordinateList))

  if (userLocation) {
    return poiFeatures.sort(
      (poi1, poi2) => parseFloat(poi1.properties.distance ?? '0') - parseFloat(poi2.properties.distance ?? '0')
    )
  }
  return poiFeatures.sort((poi1, poi2) => poi1.properties.title.localeCompare(poi2.properties.title))
}
