import { useNavigation } from '@react-navigation/native'
import { act } from '@testing-library/react-native'
import React, { useEffect } from 'react'

import {
  CATEGORIES_ROUTE,
  DISCLAIMER_ROUTE,
  EVENTS_ROUTE,
  LANDING_ROUTE,
  LOCAL_NEWS_TYPE,
  NEWS_ROUTE,
  POIS_ROUTE,
  RouteInformationType,
  SEARCH_ROUTE,
} from 'shared'

import buildConfig from '../../constants/buildConfig'
import TestingAppContext from '../../testing/TestingAppContext'
import createNavigationPropMock from '../../testing/createNavigationPropMock'
import render from '../../testing/render'
import { navigateNested } from '../../utils/navigation'
import openExternalUrl from '../../utils/openExternalUrl'
import useNavigate from '../useNavigate'

jest.mock('@react-navigation/native')
jest.mock('../../utils/navigation')
jest.mock('../../utils/openExternalUrl', () => jest.fn(async () => undefined))
jest.mock('../../navigation/url', () => ({
  urlFromRouteInformation: jest.fn(() => 'https://example.com'),
}))

jest.useFakeTimers()

describe('useNavigate', () => {
  const { mocked } = jest
  const navigation = { ...createNavigationPropMock(), canGoBack: () => true }
  mocked(useNavigation).mockImplementation(() => navigation as never)

  const cityCode = 'ansbach'
  const languageCode = 'ro'
  const params = { cityCode, languageCode }
  const cityContentPath = `/${cityCode}/${languageCode}`

  const mockedBuildConfig = mocked(buildConfig)
  const mockBuildConfig = (featureFlags: { newsStream?: boolean; pois?: boolean }) => {
    const previous = buildConfig()
    mockedBuildConfig.mockImplementation(() => ({
      ...previous,
      featureFlags: { ...previous.featureFlags, ...featureFlags },
    }))
  }

  const MockComponent = ({
    routeInformation,
    redirect,
  }: {
    routeInformation: RouteInformationType
    redirect: boolean
  }) => {
    const { navigateTo } = useNavigate({ redirect })
    useEffect(() => {
      navigateTo(routeInformation)
    }, [navigateTo, routeInformation])

    return null
  }

  const renderMockComponent = (routeInformation: RouteInformationType, redirect = false) =>
    render(
      <TestingAppContext cityCode={cityCode} languageCode={languageCode}>
        <MockComponent routeInformation={routeInformation} redirect={redirect} />
      </TestingAppContext>,
      false,
    )

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should navigate to landing', () => {
    renderMockComponent({
      route: LANDING_ROUTE,
      languageCode,
    })
    expect(navigation.push).toHaveBeenCalledWith(LANDING_ROUTE)
    expect(navigation.push).toHaveBeenCalledTimes(1)
  })

  it('should navigate to landing', () => {
    renderMockComponent(
      {
        route: LANDING_ROUTE,
        languageCode,
      },
      true,
    )
    expect(navigation.replace).toHaveBeenCalledWith(LANDING_ROUTE)
    expect(navigation.replace).toHaveBeenCalledTimes(1)
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
    act(() => jest.runAllTimers())
    expect(navigation.push).not.toHaveBeenCalled()
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
    act(() => jest.runAllTimers())
    expect(navigation.push).not.toHaveBeenCalled()
    expect(openExternalUrl).toHaveBeenCalledTimes(1)
    expect(openExternalUrl).toHaveBeenCalledWith('https://example.com', expect.any(Function))
  })

  it('should pop redirect route when opening a route externally', () => {
    const cityContentPath = `/${cityCode}/asdf/willkommen`
    renderMockComponent(
      {
        route: CATEGORIES_ROUTE,
        cityContentPath,
        cityCode: 'asdf',
        languageCode,
      },
      true,
    )
    act(() => jest.runAllTimers())
    expect(navigation.push).not.toHaveBeenCalled()
    expect(openExternalUrl).toHaveBeenCalledTimes(1)
    expect(openExternalUrl).toHaveBeenCalledWith('https://example.com', expect.any(Function))
    expect(navigation.pop).toHaveBeenCalledTimes(1)
  })

  it('should navigate to categories route', () => {
    renderMockComponent({
      route: CATEGORIES_ROUTE,
      cityContentPath,
      ...params,
    })
    expect(navigation.push).not.toHaveBeenCalled()
    expect(navigateNested).toHaveBeenCalledWith(navigation, CATEGORIES_ROUTE, { path: cityContentPath }, false)
    expect(navigateNested).toHaveBeenCalledTimes(1)
  })

  it('should redirect to categories route', () => {
    renderMockComponent(
      {
        route: CATEGORIES_ROUTE,
        cityContentPath,
        ...params,
      },
      true,
    )
    expect(navigation.push).not.toHaveBeenCalled()
    expect(navigateNested).toHaveBeenCalledWith(navigation, CATEGORIES_ROUTE, { path: cityContentPath }, true)
    expect(navigateNested).toHaveBeenCalledTimes(1)
  })

  it('should navigate to disclaimer route', () => {
    renderMockComponent({
      route: DISCLAIMER_ROUTE,
      ...params,
    })
    expect(navigation.push).toHaveBeenCalledWith(DISCLAIMER_ROUTE)
    expect(navigation.push).toHaveBeenCalledTimes(1)
  })

  it('should navigate to events route', () => {
    renderMockComponent({
      route: EVENTS_ROUTE,
      ...params,
      slug: '1234',
    })
    expect(navigation.push).not.toHaveBeenCalled()
    expect(navigateNested).toHaveBeenCalledWith(navigation, EVENTS_ROUTE, { slug: '1234' }, false)
    renderMockComponent({
      route: EVENTS_ROUTE,
      ...params,
    })
    expect(navigateNested).toHaveBeenCalledWith(navigation, EVENTS_ROUTE, { slug: undefined }, false)
    expect(navigateNested).toHaveBeenCalledTimes(2)
  })

  it('should navigate to news route', () => {
    mockBuildConfig({
      newsStream: true,
    })
    renderMockComponent({
      route: NEWS_ROUTE,
      ...params,
      newsType: LOCAL_NEWS_TYPE,
      newsId: 1234,
    })
    expect(navigation.push).not.toHaveBeenCalled()
    expect(navigateNested).toHaveBeenCalledWith(
      navigation,
      NEWS_ROUTE,
      {
        newsType: LOCAL_NEWS_TYPE,
        newsId: 1234,
      },
      false,
    )
    expect(navigateNested).toHaveBeenCalledTimes(1)
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
    expect(navigation.push).not.toHaveBeenCalled()
    expect(navigateNested).toHaveBeenCalledWith(navigation, POIS_ROUTE, { slug: '1234' }, false)
    renderMockComponent({
      route: POIS_ROUTE,
      ...params,
    })
    expect(navigateNested).toHaveBeenCalledWith(navigation, POIS_ROUTE, { slug: undefined }, false)
    expect(navigateNested).toHaveBeenCalledTimes(2)
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
    expect(navigation.push).toHaveBeenCalledWith(SEARCH_ROUTE, { searchText: undefined })
    expect(navigation.push).toHaveBeenCalledTimes(1)
  })
})
