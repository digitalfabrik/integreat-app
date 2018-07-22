// @flow

import { apiUrl } from '../../constants'
import ParamMissingError from '../../errors/ParamMissingError'
import FeedbackEndpointBuilder from '../../FeedbackEndpointBuilder'

const CATEGORIES_FEEDBACK_ENDPOINT_NAME = 'categoriesFeedback'
const POSITIVE_RATING_STRING = 'up'
const NEGATIVE_RATING_STRING = 'down'

export default new FeedbackEndpointBuilder(CATEGORIES_FEEDBACK_ENDPOINT_NAME)
  .withParamsToUrlMapper((params): string => {
    if (!params.city) {
      throw new ParamMissingError(CATEGORIES_FEEDBACK_ENDPOINT_NAME, 'city')
    }
    if (!params.language) {
      throw new ParamMissingError(CATEGORIES_FEEDBACK_ENDPOINT_NAME, 'language')
    }
    return `${apiUrl}/${params.city}/${params.language}/wp-json/extensions/v3/feedback`
  })
  .withParamsToBodyMapper((params): FormData => {
    if (params.id === undefined) {
      throw new ParamMissingError(CATEGORIES_FEEDBACK_ENDPOINT_NAME, 'page id')
    }

    if (params.isPositiveRating === undefined && !params.comment) {
      throw new ParamMissingError(CATEGORIES_FEEDBACK_ENDPOINT_NAME, 'rating/comment')
    }

    const formData = new FormData()
    formData.append('id', `${params.id}`)

    if (params.isPositiveRating !== undefined) {
      formData.append('rating', params.isPositiveRating ? POSITIVE_RATING_STRING : NEGATIVE_RATING_STRING)
    }

    if (params.comment) {
      formData.append('comment', params.comment)
    }
    return formData
  })
  .build()
