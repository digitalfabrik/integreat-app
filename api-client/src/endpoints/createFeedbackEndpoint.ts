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
  city: string
  language: string
  query?: string
  slug?: string
}
export type AdditionalParamsType =
  | {
      isPositiveRating: boolean
      comment: string | null
    }
  | {
      isPositiveRating: boolean | null
      comment: string
    }

export default (baseUrl: string): Endpoint<ParamsType & AdditionalParamsType, void> =>
  new EndpointBuilder<ParamsType & AdditionalParamsType, void>(FEEDBACK_ENDPOINT_NAME)
    .withParamsToUrlMapper(params => {
      const { city, language } = params

      return `${baseUrl}/${city}/${language}/wp-json/extensions/v3/feedback/${params.feedbackType}/`
    })
    .withParamsToBodyMapper((params: ParamsType & AdditionalParamsType): FormData => {
      const formData = new FormData()
      if (params.isPositiveRating !== null) {
        formData.append('rating', params.isPositiveRating ? POSITIVE_RATING : NEGATIVE_RATING)
      }

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
