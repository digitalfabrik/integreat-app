import {
  CATEGORIES_ROUTE,
  IMPRINT_ROUTE,
  EVENTS_ROUTE,
  PLACES_ROUTE,
  SEARCH_ROUTE,
  TU_NEWS_TYPE,
} from '../../../routes/index.ts'
import { API_VERSION } from '../../constants/index.ts'
import createFeedbackEndpoint, { FeedbackTypes } from '../createFeedbackEndpoint.ts'

describe('feedback', () => {
  const baseUrl = 'https://integreat-api-url.de'
  const feedback = createFeedbackEndpoint(baseUrl)

  it('should map params to url', () => {
    expect(
      feedback.mapParamsToUrl({
        region: 'augsburg',
        language: 'de',
        comment: '',
        contactMail: '',
        routeType: CATEGORIES_ROUTE,
        isPositiveRating: true,
      }),
    ).toBe(`https://integreat-api-url.de/api/${API_VERSION}/augsburg/de/feedback/categories/`)
  })

  it('should create the correct feedback endpoint', () => {
    expect(
      feedback.mapParamsToUrl({
        region: 'augsburg',
        language: 'de',
        comment: '',
        contactMail: '',
        routeType: CATEGORIES_ROUTE,
        isPositiveRating: true,
        slug: `willkommen`,
      }),
    ).toBe(`https://integreat-api-url.de/api/${API_VERSION}/augsburg/de/feedback/page/`)
  })

  it('should map the params to the body', () => {
    const formData = new FormData()
    formData.append('rating', 'up')
    formData.append('comment', 'comment    Kontaktadresse: Keine Angabe')
    formData.append('query', 'query full')
    formData.append('category', 'Inhalte')
    expect(feedback.mapParamsToBody).not.toBeNull()
    expect(feedback.mapParamsToBody).toBeDefined()

    if (!feedback.mapParamsToBody) {
      throw new Error('Feedback Check for Typescript failed - Check your test')
    }

    expect(
      feedback.mapParamsToBody({
        region: 'augsburg',
        language: 'de',
        isPositiveRating: true,
        routeType: CATEGORIES_ROUTE,
        comment: 'comment',
        contactMail: '',
        query: 'query',
        searchTerm: 'query full',
      }),
    ).toEqual(formData)
  })

  it.each`
    route               | props                     | feedbackType
    ${CATEGORIES_ROUTE} | ${{}}                     | ${FeedbackTypes.Categories}
    ${CATEGORIES_ROUTE} | ${{ slug: 'willkommen' }} | ${FeedbackTypes.Page}
    ${EVENTS_ROUTE}     | ${{}}                     | ${FeedbackTypes.Events}
    ${EVENTS_ROUTE}     | ${{ slug: '1234' }}       | ${FeedbackTypes.Event}
    ${IMPRINT_ROUTE}    | ${{}}                     | ${FeedbackTypes.Imprint}
    ${PLACES_ROUTE}     | ${{ slug: '1234' }}       | ${FeedbackTypes.Place}
    ${PLACES_ROUTE}     | ${{}}                     | ${FeedbackTypes.Map}
    ${SEARCH_ROUTE}     | ${{ query: 'query ' }}    | ${FeedbackTypes.Search}
    ${TU_NEWS_TYPE}     | ${{}}                     | ${FeedbackTypes.Categories}
  `(
    'should successfully request feedback for $feedbackType if rating was set',
    async ({ route, props, feedbackType }) => {
      const url = feedback.mapParamsToUrl({
        region: 'augsburg',
        language: 'de',
        isPositiveRating: true,
        routeType: route,
        comment: 'comment',
        contactMail: '',
        query: 'query',
        searchTerm: 'query full',
        ...props,
      })
      expect(url).toBe(`https://integreat-api-url.de/api/${API_VERSION}/augsburg/de/feedback/${feedbackType}/`)
    },
  )
})
