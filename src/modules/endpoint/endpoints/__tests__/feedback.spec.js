// @flow

import feedback from '../feedback'

describe('feedback', () => {
  it('should map params to url', () => {
    expect(feedback.mapParamsToUrl({
      city: 'augsburg',
      language: 'de',
      comment: null,
      feedbackType: null,
      isPositiveRating: true
    })).toEqual(
      'https://cms.integreat-app.de/augsburg/de/wp-json/extensions/v3/feedback'
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
      return
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
