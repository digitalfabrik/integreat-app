import FeedbackEndpoint from '../FeedbackEndpoint'

describe('FeedbackEndpoint', () => {
  it('should map params to url', () => {
    expect(FeedbackEndpoint.mapParamsToUrl({city: 'augsburg', language: 'de'})).toEqual(
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
    expect(FeedbackEndpoint.mapParamsToFormData({
      id: 1234, isPositiveRating: true, comment: 'comment', alias: 'alias', query: 'query'
    })).toEqual(formData)
  })
})
