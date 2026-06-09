import { safeParseInt } from '../utils/index.js'
import { NonNullableRouteInformationType } from './RouteInformationTypes.js'
import { PLACES_ROUTE, SEARCH_ROUTE } from './index.js'

export const MULTI_PLACE_QUERY_KEY = 'multiplace'
export const SEARCH_QUERY_KEY = 'query'
export const CHAT_QUERY_KEY = 'chat'
export const PLACE_CATEGORY_QUERY_KEY = 'category'
export const ZOOM_QUERY_KEY = 'zoom'

export const queryStringFromRouteInformation = (
  routeInformation: NonNullableRouteInformationType,
): string | undefined => {
  const queryParams = []
  if ('chat' in routeInformation && routeInformation.chat) {
    queryParams.push([CHAT_QUERY_KEY, routeInformation.chat.toString()])
  }
  if (routeInformation.route === PLACES_ROUTE) {
    const { multiPlace, placeCategoryId, zoom } = routeInformation
    if (multiPlace !== undefined) {
      queryParams.push([MULTI_PLACE_QUERY_KEY, multiPlace.toString()])
    }
    if (placeCategoryId !== undefined) {
      queryParams.push([PLACE_CATEGORY_QUERY_KEY, placeCategoryId.toString()])
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

export type VisibilityQueryParams = {
  chat?: boolean
}

type QueryParams = VisibilityQueryParams & {
  searchText?: string
  multiPlace?: number
  placeCategoryId?: number
  zoom?: number
}

export const parseQueryParams = (queryParams: URLSearchParams): QueryParams => {
  const searchText = queryParams.get(SEARCH_QUERY_KEY) ?? undefined
  const chat = queryParams.get(CHAT_QUERY_KEY) ? queryParams.get(CHAT_QUERY_KEY) === 'true' : undefined
  const multiPlace = safeParseInt(queryParams.get(MULTI_PLACE_QUERY_KEY))
  const placeCategoryId = safeParseInt(queryParams.get(PLACE_CATEGORY_QUERY_KEY))
  const zoom = safeParseInt(queryParams.get(ZOOM_QUERY_KEY))
  return { searchText, multiPlace, placeCategoryId, zoom, chat }
}

export const toQueryParams = ({
  multiPlace,
  placeCategoryId,
  zoom,
  searchText,
  chat,
}: QueryParams): URLSearchParams => {
  const queryParams: [string, string | undefined][] = [
    [SEARCH_QUERY_KEY, searchText],
    [CHAT_QUERY_KEY, chat?.toString()],
    [MULTI_PLACE_QUERY_KEY, multiPlace?.toString()],
    [PLACE_CATEGORY_QUERY_KEY, placeCategoryId?.toString()],
    [ZOOM_QUERY_KEY, zoom?.toString()],
  ]
  return new URLSearchParams(
    queryParams.filter((it): it is [string, string] => it[1] !== undefined && it[1].length !== 0),
  )
}
