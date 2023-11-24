import distance from '@turf/distance'

import { featureLayerId, LocationType, PoiModel } from '../index'
import { GeoJsonPoi, MapFeature, MapFeatureCollection } from '../maps'

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
  userLocation?: LocationType,
): MapFeature => ({
  type: 'Feature',
  id: id.toString(),
  geometry: {
    type: 'Point',
    coordinates,
  },
  properties: { pois: pois.map(poi => poi.getFeature(userLocation)) },
  layer: { id: featureLayerId },
})

export const prepareFeatureLocations = (pois: PoiModel[], userLocation?: LocationType): MapFeature[] => {
  const clusterCoordinates: [number, number][] = []
  const poiClusters = pois.reduce(
    (prev, poi) => {
      const clusterIndex = clusterCoordinates.findIndex(
        coordinate => distance(coordinate, poi.location.coordinates) < maxDistanceForOverlap,
      )
      if (clusterIndex !== -1) {
        prev[clusterIndex]?.push(poi)
        return prev
      }
      const newClusterIndex = clusterCoordinates.push(poi.location.coordinates)
      return { ...prev, [newClusterIndex - 1]: [poi] }
    },
    {} as { [clusterIndex: number]: PoiModel[] },
  )
  const poiFeatures = Object.values(poiClusters).map((poiCluster, clusterCoordinateIndex) =>
    prepareFeatureLocation(
      poiCluster,
      clusterCoordinateIndex,
      // the index was literaly just evalueated in the line before
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      clusterCoordinates[clusterCoordinateIndex]!,
      userLocation,
    ),
  )

  return poiFeatures
}

export const sortMapFeatures = (geoJsonPois: GeoJsonPoi[]): GeoJsonPoi[] =>
  geoJsonPois[0]?.distance // if one feature has distance all features have distance
    ? geoJsonPois.sort(
        (geoJsonPoi1, geoJsonPoi2) => parseFloat(geoJsonPoi1.distance ?? '0') - parseFloat(geoJsonPoi2.distance ?? '0'),
      )
    : geoJsonPois.sort((geoJsonPoi1, geoJsonPoi2) => geoJsonPoi1.title.localeCompare(geoJsonPoi2.title))
