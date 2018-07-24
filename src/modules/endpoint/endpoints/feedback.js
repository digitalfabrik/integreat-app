// @flow

import { apiUrl } from '../constants'
import ParamMissingError from '../errors/ParamMissingError'
import FeedbackEndpointBuilder from '../FeedbackEndpointBuilder'

const CATEGORIES_FEEDBACK_ENDPOINT_NAME = 'categoriesFeedback'
export const POSITIVE_RATING = 'up'
export const NEGATIVE_RATING = 'down'

export const PAGE_FEEDBACK_TYPE = null
export const EXTRA_FEEDBACK_TYPE = 'extra'
export const SEARCH_FEEDBACK_TYPE = 'search'

export const CATEGORIES_FEEDBACK_TYPE = 'categories'
export const EVENTS_FEEDBACK_TYPE = 'events'
export const CITIES_FEEDBACK_TYPE = 'cities'
export const EXTRAS_FEEDBACK_TYPE = 'extras'

export const INTEGREAT_INSTANCE = 'Integreat'
export const DEFAULT_FEEDBACK_LANGUAGE = 'de'

export type RatingType = POSITIVE_RATING | NEGATIVE_RATING | null
export type FeedbackType = PAGE_FEEDBACK_TYPE | EXTRA_FEEDBACK_TYPE | SEARCH_FEEDBACK_TYPE | CATEGORIES_FEEDBACK_TYPE
  | EVENTS_FEEDBACK_TYPE | CITIES_FEEDBACK_TYPE | EXTRAS_FEEDBACK_TYPE

export type FeedbackDataType = {
  type: FeedbackType,
  id?: number,
  city: string,
  language: string,
  comment: string | null,
  alias?: string,
  rating: RatingType,
  query?: string
}

export default new FeedbackEndpointBuilder(CATEGORIES_FEEDBACK_ENDPOINT_NAME)
  .withParamsToUrlMapper((params: FeedbackDataType): string => {
    if (!params.city) {
      throw new ParamMissingError(CATEGORIES_FEEDBACK_ENDPOINT_NAME, 'city')
    }
    if (!params.language) {
      throw new ParamMissingError(CATEGORIES_FEEDBACK_ENDPOINT_NAME, 'language')
    }

    return `${apiUrl}/${params.city}/${params.language}/wp-json/extensions/v3/feedback${
      params.type ? `/${params.type}` : ''}`
  })
  .withParamsToBodyMapper((params: FeedbackDataType): FormData => {
    if (!params.rating && !params.comment) {
      throw new ParamMissingError(CATEGORIES_FEEDBACK_ENDPOINT_NAME, 'rating/comment')
    }

    const formData = new FormData()
    if (params.id) {
      formData.append('id', `${params.id}`)
    }

    if (params.rating) {
      formData.append('rating', params.rating)
    }

    if (params.comment) {
      formData.append('comment', params.comment)
    }
    if (params.query) {
      formData.append('query', params.query)
    }
    if (params.alias) {
      formData.append('alias', params.alias)
    }
    return formData
  })
  .build()
