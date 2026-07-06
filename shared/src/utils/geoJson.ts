import distance from '@turf/distance'

import PlaceModel from '../api/models/PlaceModel.ts'
import { featureLayerId, MapFeature, MapFeatureCollection } from '../constants/map.ts'

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
  const multiPlaceCoordinates: [number, number][] = []
  const multiPlaces = places.reduce(
    (prev, place) => {
      const multiPlaceIndex = multiPlaceCoordinates.findIndex(
        coordinate => distance(coordinate, place.location.coordinates) < maxDistanceForOverlap,
      )
      if (multiPlaceIndex !== -1) {
        prev[multiPlaceIndex]?.push(place)
        return prev
      }
      const newMultiPlaceIndex = multiPlaceCoordinates.push(place.location.coordinates)
      return { ...prev, [newMultiPlaceIndex - 1]: [place] }
    },
    {} as { [multiPlaceIndex: number]: PlaceModel[] },
  )

  return Object.values(multiPlaces).map((multiPlace, multiPlaceCoordinateIndex) =>
    prepareMapFeature(
      multiPlace,
      multiPlaceCoordinateIndex,
      // the index was literally just evaluated in the line before
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      multiPlaceCoordinates[multiPlaceCoordinateIndex]!,
    ),
  )
}
