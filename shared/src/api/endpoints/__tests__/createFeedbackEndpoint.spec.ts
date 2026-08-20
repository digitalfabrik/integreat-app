import { RATING_NEGATIVE, RATING_POSITIVE } from '../../../constants/index.ts'
import {
  CATEGORIES_ROUTE,
  IMPRINT_ROUTE,
  EVENTS_ROUTE,
  PLACES_ROUTE,
  SEARCH_ROUTE,
  NEWS_ROUTE,
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
        rating: RATING_POSITIVE,
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
        rating: RATING_POSITIVE,
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

    expect(
      feedback.mapParamsToBody!({
        region: 'augsburg',
        language: 'de',
        rating: RATING_POSITIVE,
        routeType: CATEGORIES_ROUTE,
        comment: 'comment',
        contactMail: '',
        query: 'query',
        searchTerm: 'query full',
      }),
    ).toEqual(formData)
  })

  it('should map negative rating', () => {
    const formData = new FormData()
    formData.append('rating', 'down')
    formData.append('comment', '    Kontaktadresse: Keine Angabe')
    formData.append('category', 'Inhalte')
    expect(feedback.mapParamsToBody).not.toBeNull()
    expect(feedback.mapParamsToBody).toBeDefined()

    expect(
      feedback.mapParamsToBody!({
        region: 'augsburg',
        language: 'de',
        rating: RATING_NEGATIVE,
        routeType: CATEGORIES_ROUTE,
        comment: '',
        contactMail: '',
        query: '',
        searchTerm: '',
      }),
    ).toEqual(formData)
  })

  it('should map no rating', () => {
    const formData = new FormData()
    formData.append('comment', '    Kontaktadresse: Keine Angabe')
    formData.append('category', 'Inhalte')
    expect(feedback.mapParamsToBody).not.toBeNull()
    expect(feedback.mapParamsToBody).toBeDefined()

    expect(
      feedback.mapParamsToBody!({
        region: 'augsburg',
        language: 'de',
        rating: null,
        routeType: CATEGORIES_ROUTE,
        comment: '',
        contactMail: '',
        query: '',
        searchTerm: '',
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
    ${NEWS_ROUTE}       | ${{}}                     | ${FeedbackTypes.Categories}
  `(
    'should successfully request feedback for $feedbackType if rating was set',
    async ({ route, props, feedbackType }) => {
      const url = feedback.mapParamsToUrl({
        region: 'augsburg',
        language: 'de',
        rating: RATING_POSITIVE,
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
