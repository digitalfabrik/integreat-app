import createFeedbackEndponit, {
  CONTENT_FEEDBACK_CATEGORY,
  FeedbackType,
  TECHNICAL_FEEDBACK_CATEGORY,
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
        feedbackType: FeedbackType.categories,
        feedbackCategory: TECHNICAL_FEEDBACK_CATEGORY,
        isPositiveRating: true,
      })
    ).toBe('https://integreat-api-url.de/augsburg/de/wp-json/extensions/v3/feedback/categories')
  })
  it('should create the correct feedbackendpoint', () => {
    expect(
      feedback.mapParamsToUrl({
        city: 'augsburg',
        language: 'de',
        comment: null,
        feedbackType: FeedbackType.page,
        feedbackCategory: CONTENT_FEEDBACK_CATEGORY,
        isPositiveRating: true,
        slug: `willkommen`,
      })
    ).toBe('https://integreat-api-url.de/augsburg/de/wp-json/extensions/v3/feedback/page')
  })
  it('should map the params to the body', () => {
    const formData = new FormData()
    formData.append('rating', 'up')
    formData.append('comment', 'comment')
    formData.append('query', 'query')
    formData.append('category', 'Inhalte')
    expect(feedback.mapParamsToBody).not.toBeNull()
    expect(feedback.mapParamsToBody).toBeDefined()

    if (!feedback.mapParamsToBody) {
      throw new Error('Feedback Check for Typescript failed - Check your test')
    }

    expect(
      feedback.mapParamsToBody({
        city: 'augsburg',
        language: 'de',
        isPositiveRating: true,
        feedbackType: FeedbackType.categories,
        feedbackCategory: CONTENT_FEEDBACK_CATEGORY,
        comment: 'comment',
        query: 'query',
      })
    ).toEqual(formData)
  })
})
