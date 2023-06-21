import distance from '@turf/distance'

import { LocationType, PoiModel } from '../index'
import { GeoJsonPoi, PoiFeature, PoiFeatureCollection } from '../maps'

export const embedInCollection = (features: PoiFeature[]): PoiFeatureCollection => ({
  type: 'FeatureCollection',
  features,
})

// 5 meters
const maxDistanceForOverlap = 0.005

export const prepareFeatureLocation = (
  pois: PoiModel[],
  id: number,
  coordinates: [number, number],
  userLocation?: LocationType
): PoiFeature => ({
  type: 'Feature',
  id: id.toString(),
  geometry: {
    type: 'Point',
    coordinates,
  },
  properties: { pois: pois.map(poi => poi.getFeature(userLocation)) },
})

export const prepareFeatureLocations = (pois: Array<PoiModel>, userLocation?: LocationType): PoiFeature[] => {
  const clusterCoordinates = [] as Array<[number, number]>
  const poiClusters = pois.reduce((prev, poi) => {
    const clusterIndex = clusterCoordinates.findIndex(
      coordinate => distance(coordinate, poi.location.coordinates) < maxDistanceForOverlap
    )
    if (clusterIndex !== -1) {
      prev[clusterIndex]?.push(poi)
      return prev
    }
    const newClusterIndex = clusterCoordinates.push(poi.location.coordinates)
    return { ...prev, [newClusterIndex - 1]: [poi] }
  }, {} as Record<number, Array<PoiModel>>)
  const poiFeatures = Object.values(poiClusters).map((poiCluster, clusterCoordinateIndex) =>
    prepareFeatureLocation(
      poiCluster,
      clusterCoordinateIndex,
      clusterCoordinates[clusterCoordinateIndex]!,
      userLocation
    )
  )

  if (userLocation) {
    return poiFeatures.sort(
      (poi1, poi2) =>
        parseFloat(poi1.properties.pois[0]?.distance ?? '0') - parseFloat(poi2.properties.pois[0]?.distance ?? '0')
    )
  }
  return poiFeatures
}

export const sortPoiFeatures = (poiFeatures: GeoJsonPoi[]): GeoJsonPoi[] =>
  poiFeatures[0]?.distance // if one feature has distance all features have distance
    ? poiFeatures.sort(
        (poiFeature1, poiFeature2) => parseFloat(poiFeature1.distance ?? '0') - parseFloat(poiFeature2.distance ?? '0')
      )
    : poiFeatures.sort((poiFeature1, poiFeature2) => poiFeature1.title.localeCompare(poiFeature2.title))
