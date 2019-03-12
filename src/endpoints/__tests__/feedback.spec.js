// @flow

import feedback from '../feedback'

describe('feedback', () => {
  const apiUrl = 'https://integreat-api-url.de'

  it('should map params to url', () => {
    expect(feedback.mapParamsToUrl(apiUrl, {
      city: 'augsburg',
      language: 'de',
      comment: null,
      feedbackType: null,
      isPositiveRating: true
    })).toEqual(
      'https://integreat-api-url.de/augsburg/de/wp-json/extensions/v3/feedback'
    )
  })

  it('should map the params to the body', () => {
    const formData = new FormData()
    formData.append('rating', 'up')
    formData.append('id', '1234')
    formData.append('comment', 'comment')
    formData.append('query', 'query')
    formData.append('alias', 'alias')

    expect(feedback.mapParamsToBody).not.toBeNull()

    // For flow inspection
    if (!feedback.mapParamsToBody) {
      throw new Error('Should not happen because the previous assertion')
    }

    expect(feedback.mapParamsToBody({
      city: 'augsburg',
      language: 'de',
      id: 1234,
      isPositiveRating: true,
      feedbackType: 'categories',
      comment: 'comment',
      alias: 'alias',
      query: 'query'
    })).toEqual(formData)
  })
})
