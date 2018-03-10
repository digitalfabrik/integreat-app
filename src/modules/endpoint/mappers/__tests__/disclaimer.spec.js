import disclaimerMapper from '../disclaimer'
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

  it('should throw if there are multiple disclaimers', () => {
    expect(() => disclaimerMapper([pageJson, pageJson])).toThrowErrorMatchingSnapshot()
  })

  it('should throw if there is no disclaimer', () => {
    expect(() => disclaimerMapper([])).toThrowErrorMatchingSnapshot()
  })

  it('should throw if the disclaimer is not published', () => {
    const unpublishedPage = {...pageJson, status: 'no published'}
    expect(() => disclaimerMapper([unpublishedPage])).toThrowErrorMatchingSnapshot()
  })

  it('should map fetched data to models', () => {
    const disclaimerModel = disclaimerMapper([pageJson])
    expect(disclaimerModel).toEqual(new DisclaimerModel({
      id: pageJson.id,
      title: pageJson.title,
      content: pageJson.content
    }))
  })
})
