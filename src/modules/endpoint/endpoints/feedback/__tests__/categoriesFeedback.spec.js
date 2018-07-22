import categoriesFeedback from '../categoriesFeedback'

describe('categoriesFeedback', () => {
  it('should map params to url', () => {
    expect(categoriesFeedback.mapParamsToUrl({city: 'augsburg', language: 'de'})).toEqual(
      'https://cms.integreat-app.de/augsburg/de/wp-json/extensions/v3/feedback'
    )
  })

  it('should throw if the city to map the url are missing', () => {
    expect(() => categoriesFeedback.mapParamsToUrl({})).toThrowErrorMatchingSnapshot()
  })

  it('should throw if the language to map the url is missing', () => {
    expect(() => categoriesFeedback.mapParamsToUrl({city: 'city'})).toThrowErrorMatchingSnapshot()
  })

  it('should throw if the id to map the body is missing', () => {
    expect(() => categoriesFeedback.mapParamsToBody({})).toThrowErrorMatchingSnapshot()
  })

  it('should throw if both the rating and the comment to map the body are missing', () => {
    expect(() => categoriesFeedback.mapParamsToBody({id: 1234})).toThrowErrorMatchingSnapshot()
  })

  it('should map the params to the body', () => {
    const formData = new FormData()
    formData.append('id', '1234')
    formData.append('rating', 'up')
    formData.append('comment', 'comment')
    expect(categoriesFeedback.mapParamsToBody({id: 1234, isPositiveRating: true, comment: 'comment'})).toEqual(formData)
  })
})
