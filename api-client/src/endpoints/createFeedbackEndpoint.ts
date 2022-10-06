import Endpoint from '../Endpoint'
import EndpointBuilder from '../EndpointBuilder'

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
export const TECHNICAL_FEEDBACK_CATEGORY = 'Technisches Feedback'
export type FeedbackCategoryType = 'Inhalte' | 'Technisches Feedback'
export const INTEGREAT_INSTANCE = 'Integreat'
export const DEFAULT_FEEDBACK_LANGUAGE = 'de'
export type ParamsType = {
  feedbackType: FeedbackType
  feedbackCategory?: FeedbackCategoryType
  permalink?: string
  city: string
  language: string
  comment: string | null
  isPositiveRating: boolean
  query?: string
  slug?: string
}
export default (baseUrl: string): Endpoint<ParamsType, void> =>
  new EndpointBuilder<ParamsType, void>(FEEDBACK_ENDPOINT_NAME)
    .withParamsToUrlMapper(params => {
      const { permalink, city, language } = params
      // Make sure we use the right feedback type for the root category
      const feedbackType = permalink === `/${city}/${language}` ? FeedbackType.categories : params.feedbackType

      if (feedbackType !== params.feedbackType) {
        throw new Error('Wrong feedback type set! The feedback type for the root category must be `categories`.')
      }

      return `${baseUrl}/${city}/${language}/wp-json/extensions/v3/feedback/${feedbackType}`
    })
    .withParamsToBodyMapper((params: ParamsType): FormData => {
      const formData = new FormData()
      formData.append('rating', params.isPositiveRating ? POSITIVE_RATING : NEGATIVE_RATING)

      if (params.comment !== null) {
        formData.append('comment', params.comment)
      }

      if (params.query !== undefined) {
        formData.append('query', params.query)
      }

      if (params.feedbackCategory) {
        formData.append('category', params.feedbackCategory)
      }

      if (params.slug) {
        formData.append('slug', params.slug)
      }

      return formData
    })
    .withMapper(() => undefined)
    .build()
