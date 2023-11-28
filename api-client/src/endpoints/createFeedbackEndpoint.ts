import Endpoint from '../Endpoint'
import EndpointBuilder from '../EndpointBuilder'
import {
  CATEGORIES_ROUTE,
  CategoriesRouteType,
  DISCLAIMER_ROUTE,
  DisclaimerRouteType,
  EVENTS_ROUTE,
  EventsRouteType,
  OFFERS_ROUTE,
  OffersRouteType,
  POIS_ROUTE,
  PoisRouteType,
  SEARCH_ROUTE,
  SearchRouteType,
  SPRUNGBRETT_OFFER_ROUTE,
  SprungbrettOfferRouteType,
} from '../routes'

export const FEEDBACK_ENDPOINT_NAME = 'categoriesFeedback'
export const POSITIVE_RATING = 'up'
export const NEGATIVE_RATING = 'down'

export enum FeedbackType {
  page = 'page',
  categories = 'categories',
  offer = 'offer',
  offers = 'offers',
  search = 'search',
  event = 'event',
  events = 'events',
  imprint = 'imprint-page',
  poi = 'poi',
  map = 'map',
}

export const CONTENT_FEEDBACK_CATEGORY = 'Inhalte'

export type FeedbackRouteType =
  | CategoriesRouteType
  | EventsRouteType
  | PoisRouteType
  | OffersRouteType
  | DisclaimerRouteType
  | SearchRouteType
  | SprungbrettOfferRouteType

export type ParamsType = {
  routeType: FeedbackRouteType
  city: string
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
      return slug ? FeedbackType.event : FeedbackType.events

    case OFFERS_ROUTE:
      return slug ? FeedbackType.offer : FeedbackType.offers

    case DISCLAIMER_ROUTE:
      return FeedbackType.imprint

    case POIS_ROUTE:
      return slug ? FeedbackType.poi : FeedbackType.map

    case CATEGORIES_ROUTE:
      return slug ? FeedbackType.page : FeedbackType.categories

    case SEARCH_ROUTE:
      return FeedbackType.search

    case SPRUNGBRETT_OFFER_ROUTE:
      return FeedbackType.offer

    default:
      return FeedbackType.categories
  }
}

export default (baseUrl: string): Endpoint<ParamsType, void> =>
  new EndpointBuilder<ParamsType, void>(FEEDBACK_ENDPOINT_NAME)
    .withParamsToUrlMapper(params => {
      const { city, language, routeType, slug } = params

      return `${baseUrl}/${city}/${language}/wp-json/extensions/v3/feedback/${getFeedbackType(routeType, slug)}/`
    })
    .withParamsToBodyMapper((params: ParamsType): FormData => {
      const { isPositiveRating, comment, contactMail, query, searchTerm, slug } = params
      const formData = new FormData()

      if (isPositiveRating !== null) {
        formData.append('rating', isPositiveRating ? POSITIVE_RATING : NEGATIVE_RATING)
      }

      const queryWithSearchTerm = query === searchTerm ? query : `${searchTerm} (actual query: ${query})`
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
    .withMapper(() => undefined)
    .build()
