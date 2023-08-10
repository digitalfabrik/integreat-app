import distance from '@turf/distance'

import { LocationType, PoiModel } from '../index'
import { MapPoi, MapFeature, MapFeatureCollection } from '../maps'

export const embedInCollection = (features: MapFeature[]): MapFeatureCollection => ({
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
): MapFeature => ({
  type: 'Feature',
  id: id.toString(),
  geometry: {
    type: 'Point',
    coordinates,
  },
  properties: { pois: pois.map(poi => poi.getMapPoi(userLocation)) },
})

export const prepareFeatureLocations = (pois: Array<PoiModel>, userLocation?: LocationType): MapFeature[] => {
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
  return Object.values(poiClusters).map((poiCluster, clusterCoordinateIndex) =>
    prepareFeatureLocation(
      poiCluster,
      clusterCoordinateIndex,
      clusterCoordinates[clusterCoordinateIndex]!,
      userLocation
    )
  )
}

export const sortMapPois = (mapPois: MapPoi[]): MapPoi[] =>
  mapPois[0]?.distance // if one feature has distance all features have distance
    ? mapPois.sort((mapPoi1, mapPoi2) => parseFloat(mapPoi1.distance ?? '0') - parseFloat(mapPoi2.distance ?? '0'))
    : mapPois.sort((mapPoi1, mapPoi2) => mapPoi1.title.localeCompare(mapPoi2.title))
