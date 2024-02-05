import distance from '@turf/distance'

import PoiModel from '../api/models/PoiModel'
import { LocationType, MapFeature } from '../constants/maps'
import { prepareMapFeatures } from './geoJson'

export const calculateDistance = distance

export const sortPois = (pois: PoiModel[], userLocation: LocationType | null): PoiModel[] =>
  pois.sort((poi1, poi2) =>
    userLocation ? poi1.distance(userLocation) - poi2.distance(userLocation) : poi1.title.localeCompare(poi2.title),
  )

type PoiFiltersParams = {
  slug: string | undefined
  multipoi: string | null | undefined
  poiCategoryId: number | undefined
  currentlyOpen?: boolean | undefined
}

type PreparePoisProps = {
  pois: PoiModel[]
  params: PoiFiltersParams
}

export type PreparePoisReturn = {
  pois: PoiModel[]
  poi?: PoiModel
  mapFeatures: MapFeature[]
  mapFeature?: MapFeature
}

export const preparePois = ({ pois: allPois, params }: PreparePoisProps): PreparePoisReturn => {
  const { slug, multipoi, currentlyOpen, poiCategoryId } = params
  const poi = allPois.find(it => it.slug === slug)

  const filteredPois = allPois
    .filter(poi => poiCategoryId === undefined || poi.category.id === poiCategoryId)
    .filter(poi => !currentlyOpen || poi.isCurrentlyOpen)

  const mapFeatures = prepareMapFeatures(filteredPois)
  const mapFeature = mapFeatures.find(feature =>
    multipoi ? feature.id === multipoi : feature.properties.pois.some(poi => poi.slug === slug),
  )

  const pois =
    multipoi && mapFeature
      ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        mapFeature.properties.pois.map(it => filteredPois.find(poi => poi.slug === it.slug)!)
      : filteredPois

  return { pois, poi, mapFeature, mapFeatures }
}
