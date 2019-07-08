// @flow

import EndpointBuilder from '../EndpointBuilder'
import Endpoint from '../Endpoint'

export const FEEDBACK_ENDPOINT_NAME = 'categoriesFeedback'

export const POSITIVE_RATING = 'up'
export const NEGATIVE_RATING = 'down'

export const PAGE_FEEDBACK_TYPE = null
export const EXTRA_FEEDBACK_TYPE = 'extra'
export const SEARCH_FEEDBACK_TYPE = 'search'

export const CATEGORIES_FEEDBACK_TYPE = 'categories'
export const EVENTS_FEEDBACK_TYPE = 'events'
export const EXTRAS_FEEDBACK_TYPE = 'extras'

export type FeedbackType = null | 'extra' | 'search' | 'categories' | 'events' | 'extras'

export const INTEGREAT_INSTANCE = 'Integreat'
export const DEFAULT_FEEDBACK_LANGUAGE = 'de'

export type ParamsType = {
  feedbackType: FeedbackType,
  permalink?: string,
  city: string,
  language: string,
  comment: string | null,
  alias?: string,
  isPositiveRating: boolean,
  query?: string
}

export default (baseUrl: string): Endpoint<ParamsType, {}> => new EndpointBuilder(FEEDBACK_ENDPOINT_NAME)
  .withParamsToUrlMapper(params => {
    return `${baseUrl}/${params.city}/${params.language}/wp-json/extensions/v3/feedback${
      params.feedbackType ? `/${params.feedbackType}` : ''}`
  })
  .withParamsToBodyMapper((params: ParamsType): FormData => {
    const formData = new FormData()
    formData.append('rating', params.isPositiveRating ? POSITIVE_RATING : NEGATIVE_RATING)
    if (params.permalink) {
      formData.append('permalink', `${params.permalink}`)
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
  .withMapper(() => ({}))
  .build()
