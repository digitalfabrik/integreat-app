import disclaimer from '../disclaimer'
import DisclaimerModel from '../../models/DisclaimerModel'

jest.unmock('../disclaimer')

describe('disclaimer', () => {
  const pageJson = {
    id: 1689,
    permalink: {
      url_page: 'feedback-kontakt-und-moegliches-engagement'
    },
    title: 'Feedback, Kontakt und mögliches Engagement',
    type: 'disclaimer',
    status: 'publish',
    modified_gmt: '2017-06-12 12:27:57',
    excerpt: 'Excerpt',
    content: '<span>Content</span>',
    parent: 0
  }

  const params = {city: 'augsburg', language: 'de'}

  it('should map router to url', () => {
    expect(disclaimer.mapParamsToUrl(params)).toEqual(
      'https://cms.integreat-app.de/augsburg/de/wp-json/extensions/v0/modified_content/disclaimer' +
      '?since=1970-01-01T00:00:00Z'
    )
  })

  it('should throw if the city to map the url are missing', () => {
    expect(() => disclaimer.mapParamsToUrl({})).toThrowErrorMatchingSnapshot()
  })

  it('should throw if the language to map the url are missing', () => {
    expect(() => disclaimer.mapParamsToUrl({city: 'city'})).toThrowErrorMatchingSnapshot()
  })

  it('should throw if there are multiple disclaimers', () => {
    expect(() => disclaimer.mapResponse([pageJson, pageJson])).toThrowErrorMatchingSnapshot()
  })

  it('should throw if there is no disclaimer', () => {
    expect(() => disclaimer.mapResponse(undefined)).toThrowErrorMatchingSnapshot()
  })

  it('should throw if the disclaimer is not published', () => {
    const unpublishedPage = {...pageJson, status: 'no published'}
    expect(() => disclaimer.mapResponse([unpublishedPage])).toThrowErrorMatchingSnapshot()
  })

  it('should map fetched data to models', () => {
    const disclaimerModel = disclaimer.mapResponse([pageJson])
    expect(disclaimerModel).toEqual(new DisclaimerModel({
      id: pageJson.id,
      title: pageJson.title,
      content: pageJson.content
    }))
  })
})
