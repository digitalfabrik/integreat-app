// @flow

import LoadingError from './errors/LoadingError'
import ParamMissingError from './errors/ParamMissingError'
import { apiUrl } from './constants'

const FEEDBACK_ENDPOINT_NAME = 'categoriesFeedback'
export const POSITIVE_RATING = 'up'
export const NEGATIVE_RATING = 'down'

export const PAGE_FEEDBACK_TYPE = null
export const EXTRA_FEEDBACK_TYPE = 'extra'
export const SEARCH_FEEDBACK_TYPE = 'search'

export const CATEGORIES_FEEDBACK_TYPE = 'categories'
export const EVENTS_FEEDBACK_TYPE = 'events'
export const EXTRAS_FEEDBACK_TYPE = 'extras'

export const INTEGREAT_INSTANCE = 'Integreat'
export const DEFAULT_FEEDBACK_LANGUAGE = 'de'

export type FeedbackDataType = {
  feedbackType: string | null,
  id?: number,
  city: string,
  language: string,
  comment: string | null,
  alias?: string,
  isPositiveRating: boolean,
  query?: string
}

class FeedbackEndpoint {
  static mapParamsToUrl (params: FeedbackDataType): string {
    return `${apiUrl}/${params.city}/${params.language}/wp-json/extensions/v3/feedback${
      params.feedbackType ? `/${params.feedbackType}` : ''}`
  }

  static mapParamsToFormData (params: FeedbackDataType): FormData {
    const formData = new FormData()
    formData.append('rating', params.isPositiveRating ? POSITIVE_RATING : NEGATIVE_RATING)
    if (params.id) {
      formData.append('id', `${params.id}`)
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
  }

  static async postData (params: FeedbackDataType): Promise<void> {
    try {
      const formattedUrl = this.mapParamsToUrl(params)
      const formattedBody = this.mapParamsToFormData(params)

      const response = await fetch(formattedUrl, {
        method: 'POST',
        body: formattedBody
      })

      if (!response.ok) {
        throw new LoadingError({endpointName: FEEDBACK_ENDPOINT_NAME, message: `${response.status}`})
      }
    } catch (e) {
      let error
      if (e instanceof LoadingError || e instanceof ParamMissingError) {
        error = e
      } else {
        error = new LoadingError({endpointName: FEEDBACK_ENDPOINT_NAME, message: e.message})
      }
      console.error(error)
    }
  }
}

export default FeedbackEndpoint
