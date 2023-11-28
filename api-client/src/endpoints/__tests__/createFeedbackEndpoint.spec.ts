import {
  CATEGORIES_ROUTE,
  DISCLAIMER_ROUTE,
  EVENTS_ROUTE,
  OFFERS_ROUTE,
  POIS_ROUTE,
  SEARCH_ROUTE,
  TU_NEWS_TYPE,
} from '../../routes'
import createFeedbackEndpoint, { FeedbackType } from '../createFeedbackEndpoint'
import { SPRUNGBRETT_OFFER } from '../createSprungbrettJobsEndpoint'

describe('feedback', () => {
  const baseUrl = 'https://integreat-api-url.de'
  const feedback = createFeedbackEndpoint(baseUrl)

  it('should map params to url', () => {
    expect(
      feedback.mapParamsToUrl({
        city: 'augsburg',
        language: 'de',
        comment: '',
        contactMail: '',
        routeType: CATEGORIES_ROUTE,
        isPositiveRating: true,
      }),
    ).toBe('https://integreat-api-url.de/augsburg/de/wp-json/extensions/v3/feedback/categories/')
  })

  it('should create the correct feedback endpoint', () => {
    expect(
      feedback.mapParamsToUrl({
        city: 'augsburg',
        language: 'de',
        comment: '',
        contactMail: '',
        routeType: CATEGORIES_ROUTE,
        isPositiveRating: true,
        slug: `willkommen`,
      }),
    ).toBe('https://integreat-api-url.de/augsburg/de/wp-json/extensions/v3/feedback/page/')
  })

  it('should map the params to the body', () => {
    const formData = new FormData()
    formData.append('rating', 'up')
    formData.append('comment', 'comment    Kontaktadresse: Keine Angabe')
    formData.append('query', 'query full (actual query: query)')
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
        routeType: CATEGORIES_ROUTE,
        comment: 'comment',
        contactMail: '',
        query: 'query',
        searchTerm: 'query full',
      }),
    ).toEqual(formData)
  })

  it.each`
    route               | props                          | feedbackType
    ${CATEGORIES_ROUTE} | ${{}}                          | ${FeedbackType.categories}
    ${CATEGORIES_ROUTE} | ${{ slug: 'willkommen' }}      | ${FeedbackType.page}
    ${EVENTS_ROUTE}     | ${{}}                          | ${FeedbackType.events}
    ${EVENTS_ROUTE}     | ${{ slug: '1234' }}            | ${FeedbackType.event}
    ${OFFERS_ROUTE}     | ${{ slug: SPRUNGBRETT_OFFER }} | ${FeedbackType.offer}
    ${OFFERS_ROUTE}     | ${{}}                          | ${FeedbackType.offers}
    ${DISCLAIMER_ROUTE} | ${{}}                          | ${FeedbackType.imprint}
    ${POIS_ROUTE}       | ${{ slug: '1234' }}            | ${FeedbackType.poi}
    ${POIS_ROUTE}       | ${{}}                          | ${FeedbackType.map}
    ${SEARCH_ROUTE}     | ${{ query: 'query ' }}         | ${FeedbackType.search}
    ${TU_NEWS_TYPE}     | ${{}}                          | ${FeedbackType.categories}
  `(
    'should successfully request feedback for $feedbackType if rating was set',
    async ({ route, props, feedbackType }) => {
      const url = feedback.mapParamsToUrl({
        city: 'augsburg',
        language: 'de',
        isPositiveRating: true,
        routeType: route,
        comment: 'comment',
        contactMail: '',
        query: 'query',
        searchTerm: 'query full',
        ...props,
      })
      expect(url).toBe(`https://integreat-api-url.de/augsburg/de/wp-json/extensions/v3/feedback/${feedbackType}/`)
    },
  )
})
