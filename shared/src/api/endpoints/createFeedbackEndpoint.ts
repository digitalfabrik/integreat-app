import { Rating, RATING_NEGATIVE, RATING_POSITIVE } from '../../constants/index.ts'
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
const API_RATING_POSITIVE = 'up'
const API_RATING_NEGATIVE = 'down'

export const ApiFeedbackTypes = {
  Page: 'page',
  Categories: 'categories',
  Search: 'search',
  Event: 'event',
  Events: 'events',
  Imprint: 'imprint-page',
  Place: 'poi',
  Map: 'map',
}

type ApiFeedbackType = (typeof ApiFeedbackTypes)[keyof typeof ApiFeedbackTypes]

const CONTENT_FEEDBACK_CATEGORY = 'Inhalte'

export type FeedbackType = CategoriesRouteType | EventsRouteType | PlacesRouteType | ImprintRouteType | SearchRouteType

export type ParamsType = {
  routeType: FeedbackType
  region: string
  language: string
  comment: string
  contactMail: string
  query?: string
  slug?: string
  searchTerm?: string
  rating: Rating | null
}

const getFeedbackType = (routeType: FeedbackType, slug?: string): ApiFeedbackType => {
  switch (routeType) {
    case EVENTS_ROUTE:
      return slug ? ApiFeedbackTypes.Event : ApiFeedbackTypes.Events

    case IMPRINT_ROUTE:
      return ApiFeedbackTypes.Imprint

    case PLACES_ROUTE:
      return slug ? ApiFeedbackTypes.Place : ApiFeedbackTypes.Map

    case CATEGORIES_ROUTE:
      return slug ? ApiFeedbackTypes.Page : ApiFeedbackTypes.Categories

    case SEARCH_ROUTE:
      return ApiFeedbackTypes.Search

    default:
      return ApiFeedbackTypes.Categories
  }
}

export default (baseUrl: string): Endpoint<ParamsType, Record<string, never>> =>
  new EndpointBuilder<ParamsType, Record<string, never>>(FEEDBACK_ENDPOINT_NAME)
    .withParamsToUrlMapper(params => {
      const { region, language, routeType, slug } = params

      return `${baseUrl}/api/${API_VERSION}/${region}/${language}/feedback/${getFeedbackType(routeType, slug)}/`
    })
    .withParamsToBodyMapper((params: ParamsType): FormData => {
      const { rating, comment, contactMail, query, searchTerm, slug } = params
      const formData = new FormData()

      if (rating === RATING_POSITIVE) {
        formData.append('rating', API_RATING_POSITIVE)
      }

      if (rating === RATING_NEGATIVE) {
        formData.append('rating', API_RATING_NEGATIVE)
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
