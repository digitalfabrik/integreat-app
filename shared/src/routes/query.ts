import { Rating, RATING_NEGATIVE, RATING_POSITIVE, THEME_CONTRAST, THEME_LIGHT, ThemeType } from '../constants/index.ts'
import { safeParseInt } from '../utils/index.ts'
import { NonNullableRouteInformationType } from './RouteInformationTypes.ts'
import { PLACES_ROUTE, SEARCH_ROUTE } from './index.ts'

export const MULTI_PLACE_QUERY_KEY = 'multiplace'
export const SEARCH_QUERY_KEY = 'query'
export const CHAT_QUERY_KEY = 'chat'
export const CHAT_ID_QUERY_KEY = 'chatId'
export const THEME_QUERY_KEY = 'theme'
export const FEEDBACK_QUERY_KEY = 'feedback'
export const PLACE_CATEGORY_QUERY_KEY = 'category'
export const ZOOM_QUERY_KEY = 'zoom'

export const queryStringFromRouteInformation = (
  routeInformation: NonNullableRouteInformationType,
): string | undefined => {
  const queryParams = []
  if (CHAT_QUERY_KEY in routeInformation && routeInformation.chat) {
    queryParams.push([CHAT_QUERY_KEY, routeInformation.chat.toString()])
  }
  if (CHAT_ID_QUERY_KEY in routeInformation && routeInformation.chatId) {
    queryParams.push([CHAT_ID_QUERY_KEY, routeInformation.chatId])
  }
  if (THEME_QUERY_KEY in routeInformation && routeInformation.theme) {
    queryParams.push([THEME_QUERY_KEY, routeInformation.theme])
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
  chat?: true
  feedback?: Rating
}

type QueryParams = VisibilityQueryParams & {
  chatId?: string
  theme?: ThemeType
  searchText?: string
  multiPlace?: number
  placeCategoryId?: number
  zoom?: number
}

const parseTheme = (theme: string | null): ThemeType | undefined =>
  theme === THEME_LIGHT || theme === THEME_CONTRAST ? theme : undefined

export const parseQueryParams = (queryParams: URLSearchParams): QueryParams => {
  const searchText = queryParams.get(SEARCH_QUERY_KEY) ?? undefined
  const chat = queryParams.get(CHAT_QUERY_KEY) === 'true' || undefined
  const chatId = queryParams.get(CHAT_ID_QUERY_KEY) ?? undefined
  const theme = parseTheme(queryParams.get(THEME_QUERY_KEY))
  const feedbackQuery = queryParams.get(FEEDBACK_QUERY_KEY) ?? undefined
  const feedback = feedbackQuery === RATING_POSITIVE || feedbackQuery === RATING_NEGATIVE ? feedbackQuery : undefined
  const multiPlace = safeParseInt(queryParams.get(MULTI_PLACE_QUERY_KEY))
  const placeCategoryId = safeParseInt(queryParams.get(PLACE_CATEGORY_QUERY_KEY))
  const zoom = safeParseInt(queryParams.get(ZOOM_QUERY_KEY))
  return { searchText, multiPlace, placeCategoryId, zoom, chat, chatId, theme, feedback }
}

export const toQueryParams = ({
  multiPlace,
  placeCategoryId,
  zoom,
  searchText,
  chat,
  chatId,
  theme,
  feedback,
}: QueryParams): URLSearchParams => {
  const queryParams: [string, string | undefined][] = [
    [SEARCH_QUERY_KEY, searchText],
    [CHAT_QUERY_KEY, chat?.toString()],
    [CHAT_ID_QUERY_KEY, chatId],
    [THEME_QUERY_KEY, theme],
    [FEEDBACK_QUERY_KEY, feedback],
    [MULTI_PLACE_QUERY_KEY, multiPlace?.toString()],
    [PLACE_CATEGORY_QUERY_KEY, placeCategoryId?.toString()],
    [ZOOM_QUERY_KEY, zoom?.toString()],
  ]
  return new URLSearchParams(
    queryParams.filter((it): it is [string, string] => it[1] !== undefined && it[1].length !== 0),
  )
}
