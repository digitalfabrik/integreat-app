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
import sendTrackingSignal from '../../utils/sendTrackingSignal'
import showSnackbar from '../../utils/showSnackbar'
import createNavigate from '../createNavigate'
import navigateToDisclaimer from '../navigateToDisclaimer'
import navigateToNews from '../navigateToNews'
import navigateToOffers from '../navigateToOffers'
import navigateToPois from '../navigateToPois'
import navigateToSearch from '../navigateToSearch'

jest.mock('../navigateToDisclaimer')
jest.mock('../navigateToOffers')
jest.mock('../navigateToPois')
jest.mock('../navigateToSearch')
jest.mock('../navigateToNews')
jest.mock('../../utils/sendTrackingSignal')
jest.mock('../../utils/showSnackbar')
jest.mock('../url', () => ({
  urlFromRouteInformation: jest.fn(() => 'https://example.com'),
}))

const dispatch = jest.fn()
const navigation = createNavigationScreenPropMock()
const navigateTo = createNavigate(dispatch, navigation)
const cityCode = 'ansbach'
const languageCode = 'ro'
const params = {
  cityCode,
  languageCode,
  forceRefresh: undefined,
  key: undefined,
}
const cityContentPath = `/${cityCode}/${languageCode}`
const key = 'some-route-1234'
const forceRefresh = false

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
  const allMocks = [
    navigateToNews,
    navigateToSearch,
    navigateToPois,
    navigateToDisclaimer,
    navigateToOffers,
    navigation.navigate,
    navigation.push,
    navigation.reset,
  ]

  const assertNotCalled = (mocks: Array<CallableFunction>) =>
    mocks.forEach(mock => expect(mocked(mock)).not.toHaveBeenCalled())

  const assertOnlyCalled = (mocks: Array<CallableFunction>, times = 1) => {
    mocks.map(m => mocked(m))
    allMocks.forEach(mock => {
      if (mocks.includes(mock)) {
        expect(mock).toHaveBeenCalledTimes(times)
      } else {
        expect(mock).not.toHaveBeenCalled()
      }
    })
  }

  it('should show snackbar if empty route information is passed', () => {
    navigateTo(null)
    assertNotCalled(allMocks)
    expect(showSnackbar).toHaveBeenCalled()
  })

  it('should call navigateToLanding', () => {
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
    assertOnlyCalled([navigation.navigate])
    expect(navigation.navigate).toHaveBeenCalledWith(LANDING_ROUTE)
    expect(navigation.navigate).toHaveBeenCalledTimes(1)
  })

  it('should call navigateToJpalTracking', () => {
    mockBuildConfig({
      jpalTracking: true,
    })
    navigateTo({
      route: JPAL_TRACKING_ROUTE,
      trackingCode: 'abcdef123456',
    })
    assertOnlyCalled([navigation.navigate])
    expect(navigation.navigate).toHaveBeenCalledWith(JPAL_TRACKING_ROUTE, {})
    expect(navigation.navigate).toHaveBeenCalledTimes(1)
  })

  it('should not call navigateToJpalTracking if it is disabled in the build config', () => {
    mockBuildConfig({
      jpalTracking: false,
    })
    navigateTo({
      route: JPAL_TRACKING_ROUTE,
      trackingCode: 'abcdef123456',
    })
    assertNotCalled(allMocks)
  })

  it('should call navigation.push for categories route', () => {
    navigateTo(
      {
        route: CATEGORIES_ROUTE,
        cityContentPath,
        ...params,
      },
      key,
      forceRefresh
    )
    assertOnlyCalled([navigation.push])
    expect(navigation.push).toHaveBeenCalledWith(CATEGORIES_ROUTE, { path: cityContentPath })
    expect(sendTrackingSignal).toHaveBeenCalledWith({
      signal: {
        name: OPEN_PAGE_SIGNAL_NAME,
        pageType: CATEGORIES_ROUTE,
        url: 'https://example.com',
      },
    })
  })

  it('should call navigateToDisclaimer for disclaimer route', () => {
    navigateTo({
      route: DISCLAIMER_ROUTE,
      ...params,
    })
    assertOnlyCalled([navigateToDisclaimer])
    expect(navigateToDisclaimer).toHaveBeenCalledWith({
      dispatch,
      navigation,
      ...params,
    })
  })

  it('should call navigateToOffers for offer route', () => {
    navigateTo({
      route: OFFERS_ROUTE,
      ...params,
    })
    assertOnlyCalled([navigateToOffers])
    expect(navigateToOffers).toHaveBeenCalledWith({
      dispatch,
      navigation,
      ...params,
    })
  })

  it('should call navigation.push for events route', () => {
    navigateTo({
      route: EVENTS_ROUTE,
      ...params,
      slug: '1234',
    })
    expect(navigation.push).toHaveBeenCalledWith(EVENTS_ROUTE, { slug: '1234' })
    navigateTo(
      {
        route: EVENTS_ROUTE,
        ...params,
      },
      key,
      forceRefresh
    )
    expect(navigation.push).toHaveBeenCalledWith(EVENTS_ROUTE, { slug: undefined })
    assertOnlyCalled([navigation.push], 2)
  })

  it('should call navigateToNews for news route', () => {
    mockBuildConfig({
      newsStream: true,
    })
    navigateTo(
      {
        route: NEWS_ROUTE,
        ...params,
        newsType: LOCAL_NEWS_TYPE,
        newsId: '1234',
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
    })
  })

  it('should not call navigateToNews if it is not enabled in build config', () => {
    mockBuildConfig({
      newsStream: false,
    })
    navigateTo(
      {
        route: NEWS_ROUTE,
        ...params,
        newsType: LOCAL_NEWS_TYPE,
        newsId: '1234',
      },
      key,
      forceRefresh
    )
    assertNotCalled(allMocks)
  })

  it('should call navigateToPois for pois route', () => {
    mockBuildConfig({
      pois: true,
    })
    navigateTo(
      {
        route: POIS_ROUTE,
        ...params,
        slug: '1234',
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
      key,
    })
    navigateTo({
      route: POIS_ROUTE,
      ...params,
    })
    expect(navigateToPois).toHaveBeenLastCalledWith({
      dispatch,
      navigation,
      ...params,
      cityContentPath: undefined,
    })
    assertOnlyCalled([navigateToPois], 2)
  })

  it('should not call navigateToPois if it is not enabled in build config', () => {
    mockBuildConfig({
      pois: false,
    })
    navigateTo(
      {
        route: POIS_ROUTE,
        ...params,
        slug: '1234',
      },
      key,
      forceRefresh
    )
    assertNotCalled(allMocks)
  })

  it('should call navigateToSearch for search route', () => {
    navigateTo({
      route: SEARCH_ROUTE,
      ...params,
    })
    assertOnlyCalled([navigateToSearch])
    expect(navigateToSearch).toHaveBeenCalledWith({
      dispatch,
      navigation,
      ...params,
    })
  })
})
