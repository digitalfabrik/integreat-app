import { POIS_ROUTE, SEARCH_ROUTE } from '.'

import { safeParseInt } from '../utils'
import { NonNullableRouteInformationType } from './RouteInformationTypes'

export const MULTIPOI_QUERY_KEY = 'multipoi'
export const SEARCH_QUERY_KEY = 'query'
export const POI_CATEGORY_QUERY_KEY = 'category'
export const ZOOM_QUERY_KEY = 'zoom'

export const queryFromRouteInformation = (routeInformation: NonNullableRouteInformationType): string | undefined => {
  const searchParams = []
  if (routeInformation.route === POIS_ROUTE) {
    const { multipoi, poiCategoryId, zoom } = routeInformation
    if (multipoi !== undefined) {
      searchParams.push([MULTIPOI_QUERY_KEY, multipoi.toString()])
    }
    if (poiCategoryId !== undefined) {
      searchParams.push([POI_CATEGORY_QUERY_KEY, poiCategoryId.toString()])
    }
    if (zoom !== undefined) {
      searchParams.push([ZOOM_QUERY_KEY, zoom.toString()])
    }
  }
  if (routeInformation.route === SEARCH_ROUTE) {
    const { searchText } = routeInformation
    if (searchText) {
      searchParams.push([SEARCH_QUERY_KEY, searchText])
    }
  }
  return searchParams.length > 0 ? `?${new URLSearchParams(searchParams).toString()}` : undefined
}

type SearchParams = {
  searchText?: string
  multipoi?: number
  poiCategoryId?: number
  zoom?: number
}

export const getSearchParams = (urlSearchParams: URLSearchParams): SearchParams => {
  const searchText = urlSearchParams.get(SEARCH_QUERY_KEY) ?? undefined
  const multipoi = safeParseInt(urlSearchParams.get(MULTIPOI_QUERY_KEY))
  const poiCategoryId = safeParseInt(urlSearchParams.get(POI_CATEGORY_QUERY_KEY))
  const zoom = safeParseInt(urlSearchParams.get(ZOOM_QUERY_KEY))
  return { searchText, multipoi, poiCategoryId, zoom }
}

export const toSearchParams = ({ multipoi, poiCategoryId, zoom, searchText }: SearchParams): URLSearchParams => {
  const searchParams: [string, string | undefined][] = [
    [SEARCH_QUERY_KEY, searchText],
    [MULTIPOI_QUERY_KEY, multipoi?.toString()],
    [POI_CATEGORY_QUERY_KEY, poiCategoryId?.toString()],
    [ZOOM_QUERY_KEY, zoom?.toString()],
  ]
  return new URLSearchParams(
    searchParams.filter((it): it is [string, string] => it[1] !== undefined && it[1].length !== 0),
  )
}
