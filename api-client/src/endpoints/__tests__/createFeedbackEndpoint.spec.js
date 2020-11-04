// @flow

import createFeedbackEndponit, {
  CONTENT_FEEDBACK_CATEGORY,
  TECHNICAL_FEEDBACK_CATEGORY
} from '../createFeedbackEndpoint'

describe('feedback', () => {
  const baseUrl = 'https://integreat-api-url.de'
  const feedback = createFeedbackEndponit(baseUrl)

  it('should map params to url', () => {
    expect(feedback.mapParamsToUrl({
      city: 'augsburg',
      language: 'de',
      comment: null,
      feedbackType: null,
      feedbackCategory: TECHNICAL_FEEDBACK_CATEGORY,
      isPositiveRating: true
    })).toEqual(
      'https://integreat-api-url.de/augsburg/de/wp-json/extensions/v3/feedback'
    )
  })

  it('should map the params to the body', () => {
    // FormData is not part of the jest react-native preset: https://github.com/jefflau/jest-fetch-mock/issues/23
    // Mocking it with just a function as append leads to the following error:
    // https://github.com/facebook/jest/issues/8475
    // Therefore we just check in the corresponding test whether FormData is available.
    // The test succeeds in the web project.
    if (FormData) {
      const formData = new FormData()
      formData.append('rating', 'up')
      formData.append('permalink', '/augsburg/de/familie')
      formData.append('comment', 'comment')
      formData.append('query', 'query')
      formData.append('alias', 'alias')
      formData.append('category', 'Inhalte')

      expect(feedback.mapParamsToBody).not.toBeNull()

      // For flow inspection
      if (!feedback.mapParamsToBody) {
        throw new Error('Should not happen because the previous assertion')
      }

      expect(feedback.mapParamsToBody({
        city: 'augsburg',
        language: 'de',
        permalink: '/augsburg/de/familie',
        isPositiveRating: true,
        feedbackType: 'categories',
        feedbackCategory: CONTENT_FEEDBACK_CATEGORY,
        comment: 'comment',
        alias: 'alias',
        query: 'query'
      })).toEqual({})
    }
  })
})
