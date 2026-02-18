import { StackActions, useNavigation } from '@react-navigation/native'
import { act } from '@testing-library/react-native'
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
  OPEN_PAGE_SIGNAL_NAME,
  POIS_ROUTE,
  RouteInformationType,
  SEARCH_ROUTE,
} from 'shared'

import { RoutesType } from '../../constants/NavigationTypes'
import buildConfig from '../../constants/buildConfig'
import TestingAppContext from '../../testing/TestingAppContext'
import { createBottomTabNavigationState } from '../../testing/bottomNavigationMock'
import createNavigationPropMock from '../../testing/createNavigationPropMock'
import render from '../../testing/render'
import { buildNestedAction } from '../../utils/navigation'
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
  mocked(useNavigation).mockImplementation(() => navigation as never)

  const mockBottomTabState = ({ activeTab }: { activeTab: RoutesType }) => {
    mocked(navigation.getState).mockImplementation(() => createBottomTabNavigationState({ activeTab }))
  }

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
    useEffect(() => {
      navigateTo(routeInformation)
    }, [navigateTo, routeInformation])

    return null
  }

  const renderMockComponent = (routeInformation: RouteInformationType) =>
    render(
      <TestingAppContext cityCode={cityCode} languageCode={languageCode}>
        <MockComponent routeInformation={routeInformation} />
      </TestingAppContext>,
      false,
    )

  const expectNestedNavigation = (routeName: RoutesType, params: Record<string, unknown>) => {
    expect(navigation.reset).toHaveBeenCalledWith(buildNestedAction(routeName, params, 'bottom-tabs-key'))
  }

  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
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
    expect(navigation.dispatch).toHaveBeenCalledWith(StackActions.push(LANDING_ROUTE, undefined))
    expect(navigation.dispatch).toHaveBeenCalledTimes(1)
  })

  it('should navigate to jpal tracking', () => {
    mockBuildConfig({
      jpalTracking: true,
    })
    renderMockComponent({
      route: JPAL_TRACKING_ROUTE,
      trackingCode: 'abcdef123456',
    })
    expect(navigation.dispatch).toHaveBeenCalledWith(StackActions.push(JPAL_TRACKING_ROUTE, undefined))
    expect(navigation.dispatch).toHaveBeenCalledTimes(1)
  })

  it('should not navigate to jpal tracking if it is disabled in the build config', () => {
    mockBuildConfig({
      jpalTracking: false,
    })
    renderMockComponent({
      route: JPAL_TRACKING_ROUTE,
      trackingCode: 'abcdef123456',
    })
    expect(navigation.dispatch).not.toHaveBeenCalled()
  })

  it('should open route externally if city does not match the app settings', () => {
    const cityContentPath = `/peekingCity/${languageCode}/willkommen`
    renderMockComponent({
      route: CATEGORIES_ROUTE,
      cityContentPath,
      cityCode: 'peekingCity',
      languageCode,
    })
    expect(navigation.dispatch).not.toHaveBeenCalled()
    act(() => {
      jest.runAllTimers()
    })
    expect(openExternalUrl).toHaveBeenCalledTimes(1)
    expect(openExternalUrl).toHaveBeenCalledWith('https://example.com', expect.any(Function))
  })

  it('should open route externally if language does not match the app settings', () => {
    const cityContentPath = `/${cityCode}/asdf/willkommen`
    renderMockComponent({
      route: CATEGORIES_ROUTE,
      cityContentPath,
      cityCode: 'asdf',
      languageCode,
    })
    expect(navigation.dispatch).not.toHaveBeenCalled()
    act(() => {
      jest.runAllTimers()
    })
    expect(openExternalUrl).toHaveBeenCalledTimes(1)
    expect(openExternalUrl).toHaveBeenCalledWith('https://example.com', expect.any(Function))
  })

  it('should navigate to categories route', () => {
    mockBottomTabState({ activeTab: EVENTS_ROUTE })
    renderMockComponent({
      route: CATEGORIES_ROUTE,
      cityContentPath,
      ...params,
    })
    expect(navigation.reset).toHaveBeenCalledWith(
      buildNestedAction(CATEGORIES_ROUTE, { path: cityContentPath }, 'bottom-tabs-key'),
    )
    expect(navigation.reset).toHaveBeenCalledTimes(1)
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
    expect(navigation.dispatch).toHaveBeenCalledWith(StackActions.push(DISCLAIMER_ROUTE, undefined))
    expect(navigation.dispatch).toHaveBeenCalledTimes(1)
  })

  it('should navigate to events route', () => {
    mockBottomTabState({ activeTab: CATEGORIES_ROUTE })
    renderMockComponent({
      route: EVENTS_ROUTE,
      ...params,
      slug: '1234',
    })
    expectNestedNavigation(EVENTS_ROUTE, { slug: '1234' })
    renderMockComponent({
      route: EVENTS_ROUTE,
      ...params,
    })
    expectNestedNavigation(EVENTS_ROUTE, { slug: undefined })
    expect(navigation.reset).toHaveBeenCalledTimes(2)
  })

  it('should navigate to news route', () => {
    mockBuildConfig({
      newsStream: true,
    })
    mockBottomTabState({ activeTab: CATEGORIES_ROUTE })
    renderMockComponent({
      route: NEWS_ROUTE,
      ...params,
      newsType: LOCAL_NEWS_TYPE,
      newsId: 1234,
    })
    expectNestedNavigation(NEWS_ROUTE, {
      ...params,
      newsType: LOCAL_NEWS_TYPE,
      newsId: 1234,
    })
    expect(navigation.reset).toHaveBeenCalledTimes(1)
  })

  it('should not navigate to news if it is not enabled in build config', () => {
    mockBuildConfig({
      newsStream: false,
    })
    renderMockComponent({
      route: NEWS_ROUTE,
      ...params,
      newsType: LOCAL_NEWS_TYPE,
      newsId: 1234,
    })
    expect(navigation.dispatch).not.toHaveBeenCalled()
  })

  it('should navigate to pois route', () => {
    mockBuildConfig({
      pois: true,
    })
    mockBottomTabState({ activeTab: CATEGORIES_ROUTE })
    renderMockComponent({
      route: POIS_ROUTE,
      ...params,
      slug: '1234',
    })
    expectNestedNavigation(POIS_ROUTE, {
      slug: '1234',
      multipoi: undefined,
      zoom: undefined,
      poiCategoryId: undefined,
    })
    renderMockComponent({
      route: POIS_ROUTE,
      ...params,
    })
    expectNestedNavigation(POIS_ROUTE, { slug: undefined })
    expect(navigation.reset).toHaveBeenCalledTimes(2)
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
    expect(navigation.dispatch).not.toHaveBeenCalled()
  })

  it('should navigate to search', () => {
    renderMockComponent({
      route: SEARCH_ROUTE,
      ...params,
    })
    expect(navigation.dispatch).toHaveBeenCalledWith(StackActions.push(SEARCH_ROUTE, { searchText: undefined }))
    expect(navigation.dispatch).toHaveBeenCalledTimes(1)
  })
})
