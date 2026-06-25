import {
  CATEGORIES_ROUTE,
  CategoriesRouteType,
  IMPRINT_ROUTE,
  ImprintRouteType,
  EVENTS_ROUTE,
  EventsRouteType,
  PLACES_ROUTE,
  PlacesRouteType,
  SEARCH_ROUTE,
  SearchRouteType,
} from '../../routes/index.ts'
import Endpoint from '../Endpoint.ts'
import EndpointBuilder from '../EndpointBuilder.ts'
import { API_VERSION } from '../constants/index.ts'

export const FEEDBACK_ENDPOINT_NAME = 'categoriesFeedback'
export const POSITIVE_RATING = 'up'
export const NEGATIVE_RATING = 'down'

export const FeedbackTypes = {
  Page: 'page',
  Categories: 'categories',
  Search: 'search',
  Event: 'event',
  Events: 'events',
  Imprint: 'imprint-page',
  Place: 'poi',
  Map: 'map',
}

export type FeedbackType = (typeof FeedbackTypes)[keyof typeof FeedbackTypes]

export const CONTENT_FEEDBACK_CATEGORY = 'Inhalte'

export type FeedbackRouteType =
  | CategoriesRouteType
  | EventsRouteType
  | PlacesRouteType
  | ImprintRouteType
  | SearchRouteType

export type ParamsType = {
  routeType: FeedbackRouteType
  region: string
  language: string
  comment: string
  contactMail: string
  query?: string
  slug?: string
  searchTerm?: string
  isPositiveRating: boolean | null
}

const getFeedbackType = (routeType: FeedbackRouteType, slug?: string): FeedbackType => {
  switch (routeType) {
    case EVENTS_ROUTE:
      return slug ? FeedbackTypes.Event : FeedbackTypes.Events

    case IMPRINT_ROUTE:
      return FeedbackTypes.Imprint

    case PLACES_ROUTE:
      return slug ? FeedbackTypes.Place : FeedbackTypes.Map

    case CATEGORIES_ROUTE:
      return slug ? FeedbackTypes.Page : FeedbackTypes.Categories

    case SEARCH_ROUTE:
      return FeedbackTypes.Search

    default:
      return FeedbackTypes.Categories
  }
}

export default (baseUrl: string): Endpoint<ParamsType, Record<string, never>> =>
  new EndpointBuilder<ParamsType, Record<string, never>>(FEEDBACK_ENDPOINT_NAME)
    .withParamsToUrlMapper(params => {
      const { region, language, routeType, slug } = params

      return `${baseUrl}/api/${API_VERSION}/${region}/${language}/feedback/${getFeedbackType(routeType, slug)}/`
    })
    .withParamsToBodyMapper((params: ParamsType): FormData => {
      const { isPositiveRating, comment, contactMail, query, searchTerm, slug } = params
      const formData = new FormData()

      if (isPositiveRating !== null) {
        formData.append('rating', isPositiveRating ? POSITIVE_RATING : NEGATIVE_RATING)
      }

      const queryWithSearchTerm = searchTerm || query
      if (queryWithSearchTerm) {
        formData.append('query', queryWithSearchTerm)
      }

      if (slug) {
        formData.append('slug', slug)
      }

      formData.append('category', CONTENT_FEEDBACK_CATEGORY)

      const commentWithMail = `${comment}    Kontaktadresse: ${contactMail || 'Keine Angabe'}`
      formData.append('comment', commentWithMail)

      return formData
    })
    .withMapper(() => ({}))
    .build()
