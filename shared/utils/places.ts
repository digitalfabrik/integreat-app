import distance from '@turf/distance'

import PlaceCategoryModel from '../api/models/PlaceCategoryModel'
import PlaceModel from '../api/models/PlaceModel'
import { LocationType, MapFeature } from '../constants/map'
import { prepareMapFeatures } from './geoJson'

export const calculateDistance = distance

export const sortPlaces = (places: PlaceModel[], userLocation: LocationType | null): PlaceModel[] =>
  places.sort((place1, place2) =>
    userLocation
      ? place1.distance(userLocation) - place2.distance(userLocation)
      : place1.title.localeCompare(place2.title),
  )

type PlaceFiltersParams = {
  slug: string | undefined
  multipoi: number | undefined
  placeCategoryId: number | undefined
  currentlyOpen?: boolean | undefined
}

type PreparePlacesProps = {
  places: PlaceModel[]
  params: PlaceFiltersParams
}

export type PreparePlacesReturn = {
  places: PlaceModel[]
  place?: PlaceModel
  mapFeatures: MapFeature[]
  mapFeature?: MapFeature
  placeCategories: PlaceCategoryModel[]
  placeCategory?: PlaceCategoryModel
}

export const preparePlaces = ({ places: allPlaces, params }: PreparePlacesProps): PreparePlacesReturn => {
  const { slug, multipoi, currentlyOpen, placeCategoryId } = params
  const place = allPlaces.find(it => it.slug === slug)

  const filteredPlaces = allPlaces
    .filter(place => placeCategoryId === undefined || place.category.id === placeCategoryId)
    .filter(place => !currentlyOpen || place.isCurrentlyOpen)

  const mapFeatures = prepareMapFeatures(filteredPlaces)
  const mapFeature = mapFeatures.find(feature =>
    multipoi !== undefined ? feature.id === multipoi : feature.properties.places.some(place => place.slug === slug),
  )

  const places =
    multipoi !== undefined && mapFeature
      ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        mapFeature.properties.places.map(it => filteredPlaces.find(place => place.slug === it.slug)!)
      : filteredPlaces

  const placeCategories = allPlaces
    .map(it => it.category)
    .filter((it, index, array) => array.findIndex(value => value.id === it.id) === index)
    .sort((a, b) => a.name.localeCompare(b.name))
  const placeCategory = placeCategories.find(it => it.id === placeCategoryId)

  return { places, place, mapFeature, mapFeatures, placeCategories, placeCategory }
}
