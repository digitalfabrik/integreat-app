import createFeedbackEndponit, {
  CONTENT_FEEDBACK_CATEGORY,
  PAGE_FEEDBACK_TYPE,
  TECHNICAL_FEEDBACK_CATEGORY
} from '../createFeedbackEndpoint'

describe('feedback', () => {
  const baseUrl = 'https://integreat-api-url.de'
  const feedback = createFeedbackEndponit(baseUrl)
  it('should map params to url', () => {
    expect(
      feedback.mapParamsToUrl({
        city: 'augsburg',
        language: 'de',
        comment: null,
        feedbackType: null,
        feedbackCategory: TECHNICAL_FEEDBACK_CATEGORY,
        isPositiveRating: true
      })
    ).toEqual('https://integreat-api-url.de/augsburg/de/wp-json/extensions/v3/feedback')
  })
  it('should overwrite wrong feedback type for the root category', () => {
    expect(
      feedback.mapParamsToUrl({
        city: 'augsburg',
        language: 'de',
        comment: null,
        feedbackType: PAGE_FEEDBACK_TYPE,
        feedbackCategory: CONTENT_FEEDBACK_CATEGORY,
        isPositiveRating: true,
        permalink: `/augsburg/de/willkommen`
      })
    ).toEqual('https://integreat-api-url.de/augsburg/de/wp-json/extensions/v3/feedback')
  })
  it('should map the params to the body', () => {
    const formData = new FormData()
    formData.append('rating', 'up')
    formData.append('permalink', '/augsburg/de/familie')
    formData.append('comment', 'comment')
    formData.append('query', 'query')
    formData.append('alias', 'alias')
    formData.append('category', 'Inhalte')
    expect(feedback.mapParamsToBody).not.toBeNull()
    expect(feedback.mapParamsToBody).not.toBeUndefined()

    if (!feedback.mapParamsToBody) {
      throw new Error('Feedback Check for Typescript failed - Check your test')
    }

    expect(
      feedback.mapParamsToBody({
        city: 'augsburg',
        language: 'de',
        permalink: '/augsburg/de/familie',
        isPositiveRating: true,
        feedbackType: 'categories',
        feedbackCategory: CONTENT_FEEDBACK_CATEGORY,
        comment: 'comment',
        alias: 'alias',
        query: 'query'
      })
    ).toEqual(formData)
  })
})
