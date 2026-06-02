import distance from '@turf/distance'

import PlaceModel from '../api/models/PlaceModel'
import { featureLayerId, MapFeature, MapFeatureCollection } from '../constants/map'

export const MIN_DISTANCE_THRESHOLD = 0.1

export const embedInCollection = (features: MapFeature[]): MapFeatureCollection => ({
  type: 'FeatureCollection',
  features,
})

// 5 meters
const maxDistanceForOverlap = 0.005

export const prepareMapFeature = (places: PlaceModel[], id: number, coordinates: [number, number]): MapFeature => ({
  type: 'Feature',
  id,
  geometry: {
    type: 'Point',
    coordinates,
  },
  properties: { places: places.map(place => place.getFeature()) },
  layer: { id: featureLayerId },
})

export const prepareMapFeatures = (places: PlaceModel[]): MapFeature[] => {
  const multipoiCoordinates: [number, number][] = []
  const multipois = places.reduce(
    (prev, place) => {
      const multipoiIndex = multipoiCoordinates.findIndex(
        coordinate => distance(coordinate, place.location.coordinates) < maxDistanceForOverlap,
      )
      if (multipoiIndex !== -1) {
        prev[multipoiIndex]?.push(place)
        return prev
      }
      const newMultipoiIndex = multipoiCoordinates.push(place.location.coordinates)
      return { ...prev, [newMultipoiIndex - 1]: [place] }
    },
    {} as { [multipoiIndex: number]: PlaceModel[] },
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
