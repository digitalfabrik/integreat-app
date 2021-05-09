import createNavigate from '../createNavigate'
import createNavigationScreenPropMock from '../../../testing/createNavigationPropMock'
import navigateToDisclaimer from '../navigateToDisclaimer'
import navigateToLanding from '../navigateToLanding'
import navigateToOffers from '../navigateToOffers'
import navigateToEvents from '../navigateToEvents'
import navigateToPois from '../navigateToPois'
import navigateToSearch from '../navigateToSearch'
import navigateToNews from '../navigateToNews'
import navigateToCategory from '../navigateToCategory'
import {
  CATEGORIES_ROUTE,
  DASHBOARD_ROUTE,
  DISCLAIMER_ROUTE,
  EVENTS_ROUTE,
  JPAL_TRACKING_ROUTE,
  LANDING_ROUTE,
  LOCAL_NEWS_TYPE,
  NEWS_ROUTE,
  OFFERS_ROUTE,
  POIS_ROUTE,
  SEARCH_ROUTE
} from 'api-client/src/routes'
import buildConfig from '../../app/constants/buildConfig'
import navigateToJpalTracking from '../navigateToJpalTracking'
import sendTrackingSignal from '../../endpoint/sendTrackingSignal'
import { OPEN_PAGE_SIGNAL_NAME } from 'api-client'
jest.mock('../navigateToDisclaimer', () => jest.fn())
jest.mock('../navigateToLanding', () => jest.fn())
jest.mock('../navigateToOffers', () => jest.fn())
jest.mock('../navigateToEvents', () => jest.fn())
jest.mock('../navigateToPois', () => jest.fn())
jest.mock('../navigateToSearch', () => jest.fn())
jest.mock('../navigateToNews', () => jest.fn())
jest.mock('../navigateToCategory', () => jest.fn())
jest.mock('../navigateToJpalTracking', () => jest.fn())
jest.mock('../../endpoint/sendTrackingSignal', () => jest.fn())
jest.mock('../url', () => ({
  urlFromRouteInformation: jest.fn(() => 'https://example.com')
}))
const dispatch = jest.fn()
const navigation = createNavigationScreenPropMock()
const navigateTo = createNavigate(dispatch, navigation)
const cityCode = 'ansbach'
const languageCode = 'ro'
const params = {
  cityCode,
  languageCode
}
const cityContentPath = `/${cityCode}/${languageCode}`
const key = 'some-route-1234'
const forceRefresh = false
describe('createNavigate', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  const allMocks = [
    navigateToNews,
    navigateToEvents,
    navigateToSearch,
    navigateToCategory,
    navigateToPois,
    navigateToDisclaimer,
    navigateToLanding,
    navigateToOffers
  ]

  const assertNotCalled = mocks => mocks.forEach(mock => expect(mock).not.toHaveBeenCalled())

  const assertOnlyCalled = (mocks, times = 1) => {
    allMocks.forEach(mock => {
      if (mocks.includes(mock)) {
        expect(mock).toHaveBeenCalledTimes(times)
      } else {
        expect(mock).not.toHaveBeenCalled()
      }
    })
  }

  it('should do nothing if empty route information is passed', () => {
    navigateTo(null)
    assertNotCalled(allMocks)
  })
  it('should call navigateToLanding', () => {
    navigateTo({
      route: LANDING_ROUTE,
      languageCode
    })
    assertOnlyCalled([navigateToLanding])
    expect(sendTrackingSignal).toHaveBeenCalledWith({
      signal: {
        name: OPEN_PAGE_SIGNAL_NAME,
        pageType: LANDING_ROUTE,
        url: 'https://example.com'
      }
    })
  })
  it('should call navigateToJpalTracking', () => {
    navigateTo({
      route: JPAL_TRACKING_ROUTE,
      trackingCode: 'abcdef123456'
    })
    assertOnlyCalled([navigateToJpalTracking])
  })
  it('should not call navigateToJpalTracking if it is disabled in the build config', () => {
    // $FlowFixMe build config is a mock
    buildConfig.mockImplementationOnce(() => ({
      featureFlags: {
        jpalTracking: true
      }
    }))
    navigateTo({
      route: JPAL_TRACKING_ROUTE,
      trackingCode: 'abcdef123456'
    })
    assertNotCalled(allMocks)
  })
  it('should call navigateToCategory for dashboard route', () => {
    navigateTo(
      {
        route: DASHBOARD_ROUTE,
        cityContentPath,
        ...params
      },
      key,
      forceRefresh
    )
    assertOnlyCalled([navigateToCategory])
    expect(navigateToCategory).toHaveBeenCalledWith({
      dispatch,
      navigation,
      routeName: DASHBOARD_ROUTE,
      cityContentPath,
      ...params,
      key,
      forceRefresh
    })
    expect(sendTrackingSignal).toHaveBeenCalledWith({
      signal: {
        name: OPEN_PAGE_SIGNAL_NAME,
        pageType: DASHBOARD_ROUTE,
        url: 'https://example.com'
      }
    })
  })
  it('should call navigateToCategory for categories route', () => {
    navigateTo(
      {
        route: CATEGORIES_ROUTE,
        cityContentPath,
        ...params
      },
      key,
      forceRefresh
    )
    assertOnlyCalled([navigateToCategory])
    expect(navigateToCategory).toHaveBeenCalledWith({
      dispatch,
      navigation,
      routeName: CATEGORIES_ROUTE,
      cityContentPath,
      ...params,
      key,
      forceRefresh
    })
  })
  it('should call navigateToDisclaimer for disclaimer route', () => {
    navigateTo({
      route: DISCLAIMER_ROUTE,
      ...params
    })
    assertOnlyCalled([navigateToDisclaimer])
    expect(navigateToDisclaimer).toHaveBeenCalledWith({
      dispatch,
      navigation,
      ...params
    })
  })
  it('should call navigateToOffers for offer route', () => {
    navigateTo({
      route: OFFERS_ROUTE,
      ...params
    })
    assertOnlyCalled([navigateToOffers])
    expect(navigateToOffers).toHaveBeenCalledWith({
      dispatch,
      navigation,
      ...params
    })
  })
  it('should call navigateToEvents for events route', () => {
    navigateTo({
      route: EVENTS_ROUTE,
      ...params,
      cityContentPath
    })
    expect(navigateToEvents).toHaveBeenCalledWith({
      dispatch,
      navigation,
      ...params,
      cityContentPath
    })
    navigateTo(
      {
        route: EVENTS_ROUTE,
        ...params
      },
      key,
      forceRefresh
    )
    expect(navigateToEvents).toHaveBeenCalledWith({
      dispatch,
      navigation,
      ...params,
      key,
      forceRefresh,
      cityContentPath: null
    })
    assertOnlyCalled([navigateToEvents], 2)
  })
  it('should call navigateToNews for news route', () => {
    // $FlowFixMe build config is a mock
    buildConfig.mockImplementationOnce(() => ({
      featureFlags: {
        newsStream: true
      }
    }))
    navigateTo(
      {
        route: NEWS_ROUTE,
        ...params,
        newsType: LOCAL_NEWS_TYPE,
        newsId: '1234'
      },
      key,
      forceRefresh
    )
    assertOnlyCalled([navigateToNews])
    expect(navigateToNews).toHaveBeenCalledWith({
      dispatch,
      navigation,
      ...params,
      type: LOCAL_NEWS_TYPE,
      newsId: '1234',
      key,
      forceRefresh
    })
  })
  it('should not call navigateToNews if it is not enabled in build config', () => {
    // $FlowFixMe build config is a mock
    buildConfig.mockImplementationOnce(() => ({
      featureFlags: {
        newsStream: false
      }
    }))
    navigateTo(
      {
        route: NEWS_ROUTE,
        ...params,
        newsType: LOCAL_NEWS_TYPE,
        newsId: '1234'
      },
      key,
      forceRefresh
    )
    assertNotCalled(allMocks)
  })
  it('should call navigateToPois for pois route', () => {
    // $FlowFixMe build config is a mock
    buildConfig.mockImplementation(() => ({
      featureFlags: {
        pois: true
      }
    }))
    navigateTo(
      {
        route: POIS_ROUTE,
        ...params,
        cityContentPath
      },
      key,
      forceRefresh
    )
    expect(navigateToPois).toHaveBeenCalledWith({
      dispatch,
      navigation,
      ...params,
      cityContentPath,
      forceRefresh,
      key
    })
    navigateTo({
      route: POIS_ROUTE,
      ...params
    })
    expect(navigateToPois).toHaveBeenCalledWith({
      dispatch,
      navigation,
      ...params,
      cityContentPath: null
    })
    assertOnlyCalled([navigateToPois], 2)
  })
  it('should not call navigateToPois if it is not enabled in build config', () => {
    // $FlowFixMe build config is a mock
    buildConfig.mockImplementationOnce(() => ({
      featureFlags: {
        pois: false
      }
    }))
    navigateTo(
      {
        route: POIS_ROUTE,
        ...params,
        cityContentPath
      },
      key,
      forceRefresh
    )
    assertNotCalled(allMocks)
  })
  it('should call navigateToSearch for search route', () => {
    navigateTo({
      route: SEARCH_ROUTE,
      ...params
    })
    assertOnlyCalled([navigateToSearch])
    expect(navigateToSearch).toHaveBeenCalledWith({
      dispatch,
      navigation,
      ...params
    })
  })
})
