import { mocked } from 'jest-mock'

import { OPEN_PAGE_SIGNAL_NAME } from 'api-client'
import {
  CATEGORIES_ROUTE,
  DISCLAIMER_ROUTE,
  EVENTS_ROUTE,
  JPAL_TRACKING_ROUTE,
  LANDING_ROUTE,
  LOCAL_NEWS_TYPE,
  NEWS_ROUTE,
  OFFERS_ROUTE,
  POIS_ROUTE,
  SEARCH_ROUTE,
} from 'api-client/src/routes'

import buildConfig from '../../constants/buildConfig'
import createNavigationScreenPropMock from '../../testing/createNavigationPropMock'
import openExternalUrl from '../../utils/openExternalUrl'
import sendTrackingSignal from '../../utils/sendTrackingSignal'
import createNavigate from '../createNavigate'

jest.mock('../../utils/sendTrackingSignal')
jest.mock('../../utils/showSnackbar')
jest.mock('../../utils/openExternalUrl', () => jest.fn(async () => undefined))
jest.mock('../url', () => ({
  urlFromRouteInformation: jest.fn(() => 'https://example.com'),
}))

const navigation = createNavigationScreenPropMock()
const cityCode = 'ansbach'
const languageCode = 'ro'
const navigateTo = createNavigate(navigation, cityCode, languageCode)
const params = {
  cityCode,
  languageCode,
}
const cityContentPath = `/${cityCode}/${languageCode}`

const mockedBuildConfig = mocked(buildConfig)

const mockBuildConfig = (featureFlags: { jpalTracking?: boolean; newsStream?: boolean; pois?: boolean }) => {
  const previous = buildConfig()
  mockedBuildConfig.mockImplementation(() => ({
    ...previous,
    featureFlags: { ...previous.featureFlags, ...featureFlags },
  }))
}

describe('createNavigate', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should navigate to landing', () => {
    navigateTo({
      route: LANDING_ROUTE,
      languageCode,
    })
    expect(sendTrackingSignal).toHaveBeenCalledWith({
      signal: {
        name: OPEN_PAGE_SIGNAL_NAME,
        pageType: LANDING_ROUTE,
        url: 'https://example.com',
      },
    })
    expect(navigation.push).toHaveBeenCalledWith(LANDING_ROUTE)
    expect(navigation.push).toHaveBeenCalledTimes(1)
  })

  it('should navigate to jpal tracking', () => {
    mockBuildConfig({
      jpalTracking: true,
    })
    navigateTo({
      route: JPAL_TRACKING_ROUTE,
      trackingCode: 'abcdef123456',
    })
    expect(navigation.push).toHaveBeenCalledWith(JPAL_TRACKING_ROUTE, {})
    expect(navigation.push).toHaveBeenCalledTimes(1)
  })

  it('should not navigate to jpal tracking if it is disabled in the build config', () => {
    mockBuildConfig({
      jpalTracking: false,
    })
    navigateTo({
      route: JPAL_TRACKING_ROUTE,
      trackingCode: 'abcdef123456',
    })
    expect(navigation.push).not.toHaveBeenCalled()
  })

  it('should open route externally if city or language do not match the app settings', () => {
    const cityContentPath = `/peekingCity/${languageCode}/willkommen`
    navigateTo({
      route: CATEGORIES_ROUTE,
      cityContentPath,
      cityCode: 'peekingCity',
      languageCode,
    })
    expect(navigation.push).not.toHaveBeenCalled()
    expect(openExternalUrl).toHaveBeenCalledTimes(1)
    expect(openExternalUrl).toHaveBeenCalledWith('https://example.com')
  })

  it('should navigate to categories route', () => {
    navigateTo({
      route: CATEGORIES_ROUTE,
      cityContentPath,
      ...params,
    })
    expect(navigation.push).toHaveBeenCalledWith(CATEGORIES_ROUTE, { path: cityContentPath })
    expect(navigation.push).toHaveBeenCalledTimes(1)
    expect(sendTrackingSignal).toHaveBeenCalledWith({
      signal: {
        name: OPEN_PAGE_SIGNAL_NAME,
        pageType: CATEGORIES_ROUTE,
        url: 'https://example.com',
      },
    })
  })

  it('should navigate to disclaimer route', () => {
    navigateTo({
      route: DISCLAIMER_ROUTE,
      ...params,
    })
    expect(navigation.push).toHaveBeenCalledWith(DISCLAIMER_ROUTE, {})
    expect(navigation.push).toHaveBeenCalledTimes(1)
  })

  it('should navigate to offers route', () => {
    navigateTo({
      route: OFFERS_ROUTE,
      ...params,
    })
    expect(navigation.push).toHaveBeenCalledWith(OFFERS_ROUTE, {})
    expect(navigation.push).toHaveBeenCalledTimes(1)
  })

  it('should navigate to events route', () => {
    navigateTo({
      route: EVENTS_ROUTE,
      ...params,
      slug: '1234',
    })
    expect(navigation.push).toHaveBeenCalledWith(EVENTS_ROUTE, { slug: '1234' })
    navigateTo({
      route: EVENTS_ROUTE,
      ...params,
    })
    expect(navigation.push).toHaveBeenCalledWith(EVENTS_ROUTE, { slug: undefined })
    expect(navigation.push).toHaveBeenCalledTimes(2)
  })

  it('should navigate to news route', () => {
    mockBuildConfig({
      newsStream: true,
    })
    navigateTo({
      route: NEWS_ROUTE,
      ...params,
      newsType: LOCAL_NEWS_TYPE,
      newsId: '1234',
    })
    expect(navigation.push).toHaveBeenCalledWith(NEWS_ROUTE, {
      ...params,
      newsType: LOCAL_NEWS_TYPE,
      newsId: '1234',
    })
    expect(navigation.push).toHaveBeenCalledTimes(1)
  })

  it('should not navigate to news if it is not enabled in build config', () => {
    mockBuildConfig({
      newsStream: false,
    })
    navigateTo({
      route: NEWS_ROUTE,
      ...params,
      newsType: LOCAL_NEWS_TYPE,
      newsId: '1234',
    })
    expect(navigation.push).not.toHaveBeenCalled()
  })

  it('should navigate to pois route', () => {
    mockBuildConfig({
      pois: true,
    })
    navigateTo({
      route: POIS_ROUTE,
      ...params,
      slug: '1234',
    })
    expect(navigation.push).toHaveBeenCalledWith(POIS_ROUTE, { slug: '1234' })
    navigateTo({
      route: POIS_ROUTE,
      ...params,
    })
    expect(navigation.push).toHaveBeenCalledWith(POIS_ROUTE, { slug: undefined })
    expect(navigation.push).toHaveBeenCalledTimes(2)
  })

  it('should not navigate to pois if it is not enabled in build config', () => {
    mockBuildConfig({
      pois: false,
    })
    navigateTo({
      route: POIS_ROUTE,
      ...params,
      slug: '1234',
    })
    expect(navigation.push).not.toHaveBeenCalled()
  })

  it('should navigate to search', () => {
    navigateTo({
      route: SEARCH_ROUTE,
      ...params,
    })
    expect(navigation.push).toHaveBeenCalledWith(SEARCH_ROUTE)
    expect(navigation.push).toHaveBeenCalledTimes(1)
  })
})
