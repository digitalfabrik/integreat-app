import { useNavigation } from '@react-navigation/native'
import { mocked } from 'jest-mock'
import React, { useEffect } from 'react'

import {
  CATEGORIES_ROUTE,
  DISCLAIMER_ROUTE,
  EVENTS_ROUTE,
  JPAL_TRACKING_ROUTE,
  LANDING_ROUTE,
  LOCAL_NEWS_TYPE,
  NEWS_ROUTE,
  OFFERS_ROUTE,
  OPEN_PAGE_SIGNAL_NAME,
  POIS_ROUTE,
  RouteInformationType,
  SEARCH_ROUTE,
} from 'api-client'

import buildConfig from '../../constants/buildConfig'
import { AppContext } from '../../contexts/AppContextProvider'
import createNavigationPropMock from '../../testing/createNavigationPropMock'
import render from '../../testing/render'
import openExternalUrl from '../../utils/openExternalUrl'
import sendTrackingSignal from '../../utils/sendTrackingSignal'
import useNavigate from '../useNavigate'

jest.mock('@react-navigation/native')
jest.mock('../../utils/sendTrackingSignal')
jest.mock('../../utils/openExternalUrl', () => jest.fn(async () => undefined))
jest.mock('../../navigation/url', () => ({
  urlFromRouteInformation: jest.fn(() => 'https://example.com'),
}))

describe('useNavigate', () => {
  const navigation = createNavigationPropMock()
  mocked(useNavigation).mockImplementation(() => navigation)

  const changeCityCode = jest.fn()
  const changeLanguageCode = jest.fn()
  const cityCode = 'ansbach'
  const languageCode = 'ro'
  const params = { cityCode, languageCode }
  const cityContentPath = `/${cityCode}/${languageCode}`

  const mockedBuildConfig = mocked(buildConfig)
  const mockBuildConfig = (featureFlags: { jpalTracking?: boolean; newsStream?: boolean; pois?: boolean }) => {
    const previous = buildConfig()
    mockedBuildConfig.mockImplementation(() => ({
      ...previous,
      featureFlags: { ...previous.featureFlags, ...featureFlags },
    }))
  }

  const MockComponent = ({ routeInformation }: { routeInformation: RouteInformationType }) => {
    const { navigateTo } = useNavigate()
    useEffect(() => navigateTo(routeInformation), [navigateTo, routeInformation])

    return null
  }

  const renderMockComponent = (routeInformation: RouteInformationType) =>
    render(
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      <AppContext.Provider value={{ changeCityCode, changeLanguageCode, cityCode, languageCode }}>
        <MockComponent routeInformation={routeInformation} />
      </AppContext.Provider>
    )

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should navigate to landing', () => {
    renderMockComponent({
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
    renderMockComponent({
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
    renderMockComponent({
      route: JPAL_TRACKING_ROUTE,
      trackingCode: 'abcdef123456',
    })
    expect(navigation.push).not.toHaveBeenCalled()
  })

  it('should open route externally if city does not match the app settings', () => {
    const cityContentPath = `/peekingCity/${languageCode}/willkommen`
    renderMockComponent({
      route: CATEGORIES_ROUTE,
      cityContentPath,
      cityCode: 'peekingCity',
      languageCode,
    })
    expect(navigation.push).not.toHaveBeenCalled()
    expect(openExternalUrl).toHaveBeenCalledTimes(1)
    expect(openExternalUrl).toHaveBeenCalledWith('https://example.com')
  })

  it('should open route externally if language does not match the app settings', () => {
    const cityContentPath = `/${cityCode}/asdf/willkommen`
    renderMockComponent({
      route: CATEGORIES_ROUTE,
      cityContentPath,
      cityCode: 'asdf',
      languageCode,
    })
    expect(navigation.push).not.toHaveBeenCalled()
    expect(openExternalUrl).toHaveBeenCalledTimes(1)
    expect(openExternalUrl).toHaveBeenCalledWith('https://example.com')
  })

  it('should navigate to categories route', () => {
    renderMockComponent({
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
    renderMockComponent({
      route: DISCLAIMER_ROUTE,
      ...params,
    })
    expect(navigation.push).toHaveBeenCalledWith(DISCLAIMER_ROUTE, {})
    expect(navigation.push).toHaveBeenCalledTimes(1)
  })

  it('should navigate to offers route', () => {
    renderMockComponent({
      route: OFFERS_ROUTE,
      ...params,
    })
    expect(navigation.push).toHaveBeenCalledWith(OFFERS_ROUTE, {})
    expect(navigation.push).toHaveBeenCalledTimes(1)
  })

  it('should navigate to events route', () => {
    renderMockComponent({
      route: EVENTS_ROUTE,
      ...params,
      slug: '1234',
    })
    expect(navigation.push).toHaveBeenCalledWith(EVENTS_ROUTE, { slug: '1234' })
    renderMockComponent({
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
    renderMockComponent({
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
    renderMockComponent({
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
    renderMockComponent({
      route: POIS_ROUTE,
      ...params,
      slug: '1234',
    })
    expect(navigation.push).toHaveBeenCalledWith(POIS_ROUTE, { slug: '1234' })
    renderMockComponent({
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
    renderMockComponent({
      route: POIS_ROUTE,
      ...params,
      slug: '1234',
    })
    expect(navigation.push).not.toHaveBeenCalled()
  })

  it('should navigate to search', () => {
    renderMockComponent({
      route: SEARCH_ROUTE,
      ...params,
    })
    expect(navigation.push).toHaveBeenCalledWith(SEARCH_ROUTE)
    expect(navigation.push).toHaveBeenCalledTimes(1)
  })
})
