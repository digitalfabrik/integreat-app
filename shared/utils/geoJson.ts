import distance from '@turf/distance'

import PoiModel from '../api/models/PoiModel'
import { featureLayerId, MapFeature, MapFeatureCollection } from '../constants/maps'

export const MIN_DISTANCE_THRESHOLD = 0.1

export const embedInCollection = (features: MapFeature[]): MapFeatureCollection => ({
  type: 'FeatureCollection',
  features,
})

// 5 meters
const maxDistanceForOverlap = 0.005

export const prepareMapFeature = (pois: PoiModel[], id: number, coordinates: [number, number]): MapFeature => ({
  type: 'Feature',
  id: id.toString(),
  geometry: {
    type: 'Point',
    coordinates,
  },
  properties: { pois: pois.map(poi => poi.getFeature()) },
  layer: { id: featureLayerId },
})

export const prepareMapFeatures = (pois: PoiModel[]): MapFeature[] => {
  const multipoiCoordinates: [number, number][] = []
  const multipois = pois.reduce(
    (prev, poi) => {
      const multipoiIndex = multipoiCoordinates.findIndex(
        coordinate => distance(coordinate, poi.location.coordinates) < maxDistanceForOverlap,
      )
      if (multipoiIndex !== -1) {
        prev[multipoiIndex]?.push(poi)
        return prev
      }
      const newMultipoiIndex = multipoiCoordinates.push(poi.location.coordinates)
      return { ...prev, [newMultipoiIndex - 1]: [poi] }
    },
    {} as { [multipoiIndex: number]: PoiModel[] },
  )

  return Object.values(multipois).map((multipoi, multipoiCoordinateIndex) =>
    prepareMapFeature(
      multipoi,
      multipoiCoordinateIndex,
      // the index was literally just evaluated in the line before
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      multipoiCoordinates[multipoiCoordinateIndex]!,
    ),
  )
}
