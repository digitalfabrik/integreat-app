import { POIS_ROUTE, SEARCH_ROUTE } from '.'

import { safeParseInt } from '../utils'
import { NonNullableRouteInformationType } from './RouteInformationTypes'

export const MULTIPOI_QUERY_KEY = 'multipoi'
export const SEARCH_QUERY_KEY = 'query'
export const CHAT_QUERY_KEY = 'chat'
export const POI_CATEGORY_QUERY_KEY = 'category'
export const ZOOM_QUERY_KEY = 'zoom'

export const queryStringFromRouteInformation = (
  routeInformation: NonNullableRouteInformationType,
): string | undefined => {
  const queryParams = []
  if ('chat' in routeInformation && routeInformation.chat) {
    queryParams.push([CHAT_QUERY_KEY, routeInformation.chat.toString()])
  }
  if (routeInformation.route === POIS_ROUTE) {
    const { multipoi, poiCategoryId, zoom } = routeInformation
    if (multipoi !== undefined) {
      queryParams.push([MULTIPOI_QUERY_KEY, multipoi.toString()])
    }
    if (poiCategoryId !== undefined) {
      queryParams.push([POI_CATEGORY_QUERY_KEY, poiCategoryId.toString()])
    }
    if (zoom !== undefined) {
      queryParams.push([ZOOM_QUERY_KEY, zoom.toString()])
    }
  }
  if (routeInformation.route === SEARCH_ROUTE) {
    const { searchText } = routeInformation
    if (searchText) {
      queryParams.push([SEARCH_QUERY_KEY, searchText])
    }
  }
  return queryParams.length > 0 ? `?${new URLSearchParams(queryParams).toString()}` : undefined
}

type QueryParams = {
  searchText?: string
  chat?: boolean
  multipoi?: number
  poiCategoryId?: number
  zoom?: number
}

export const parseQueryParams = (queryParams: URLSearchParams): QueryParams => {
  const searchText = queryParams.get(SEARCH_QUERY_KEY) ?? undefined
  const chat = queryParams.get(CHAT_QUERY_KEY) ? queryParams.get(CHAT_QUERY_KEY) === 'true' : undefined
  const multipoi = safeParseInt(queryParams.get(MULTIPOI_QUERY_KEY))
  const poiCategoryId = safeParseInt(queryParams.get(POI_CATEGORY_QUERY_KEY))
  const zoom = safeParseInt(queryParams.get(ZOOM_QUERY_KEY))
  return { searchText, multipoi, poiCategoryId, zoom, chat }
}

export const toQueryParams = ({ multipoi, poiCategoryId, zoom, searchText, chat }: QueryParams): URLSearchParams => {
  const queryParams: [string, string | undefined][] = [
    [SEARCH_QUERY_KEY, searchText],
    [CHAT_QUERY_KEY, chat?.toString()],
    [MULTIPOI_QUERY_KEY, multipoi?.toString()],
    [POI_CATEGORY_QUERY_KEY, poiCategoryId?.toString()],
    [ZOOM_QUERY_KEY, zoom?.toString()],
  ]
  return new URLSearchParams(
    queryParams.filter((it): it is [string, string] => it[1] !== undefined && it[1].length !== 0),
  )
}
