import { useNavigation } from '@react-navigation/native'
import { act } from '@testing-library/react-native'
import React, { useEffect } from 'react'

import {
  BOTTOM_TAB_NAVIGATION_ROUTE,
  CATEGORIES_ROUTE,
  CATEGORIES_TAB_ROUTE,
  IMPRINT_ROUTE,
  EVENTS_ROUTE,
  LANDING_ROUTE,
  LOCAL_NEWS_TYPE,
  NEWS_ROUTE,
  POIS_ROUTE,
  RouteInformationType,
  SEARCH_ROUTE,
} from 'shared'

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

  it('should navigate to imprint route', () => {
    renderMockComponent({
      route: IMPRINT_ROUTE,
      ...params,
    })
    expect(navigation.push).toHaveBeenCalledWith(IMPRINT_ROUTE)
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

  it('should navigate to pois route', () => {
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

  it('should navigate to search', () => {
    renderMockComponent({
      route: SEARCH_ROUTE,
      ...params,
    })
    expect(navigation.push).toHaveBeenCalledWith(SEARCH_ROUTE, { searchText: undefined })
    expect(navigation.push).toHaveBeenCalledTimes(1)
  })

  it('should navigate to search with searchText', () => {
    renderMockComponent({
      route: SEARCH_ROUTE,
      ...params,
      searchText: 'hello',
    })
    expect(navigation.push).toHaveBeenCalledWith(SEARCH_ROUTE, { searchText: 'hello' })
    expect(navigation.push).toHaveBeenCalledTimes(1)
  })

  it('should replace when redirecting to search', () => {
    renderMockComponent({ route: SEARCH_ROUTE, ...params, searchText: 'test' }, true)
    expect(navigation.replace).toHaveBeenCalledWith(SEARCH_ROUTE, { searchText: 'test' })
    expect(navigation.push).not.toHaveBeenCalled()
  })

  it('should replace when redirecting to imprint', () => {
    renderMockComponent({ route: IMPRINT_ROUTE, ...params }, true)
    expect(navigation.replace).toHaveBeenCalledWith(IMPRINT_ROUTE)
    expect(navigation.push).not.toHaveBeenCalled()
  })

  it('should navigate to pois route with all optional params', () => {
    renderMockComponent({
      route: POIS_ROUTE,
      ...params,
      slug: 'some-poi',
      multipoi: 42,
      zoom: 15,
      poiCategoryId: 7,
    })
    expect(navigateNested).toHaveBeenCalledWith(
      navigation,
      POIS_ROUTE,
      {
        slug: 'some-poi',
        multipoi: 42,
        zoom: 15,
        poiCategoryId: 7,
      },
      false,
    )
    expect(navigateNested).toHaveBeenCalledTimes(1)
  })

  it('should pass null for newsId when not provided', () => {
    renderMockComponent({
      route: NEWS_ROUTE,
      ...params,
      newsType: LOCAL_NEWS_TYPE,
    })
    expect(navigateNested).toHaveBeenCalledWith(
      navigation,
      NEWS_ROUTE,
      { newsType: LOCAL_NEWS_TYPE, newsId: null },
      false,
    )
  })

  it('should replace with bottom tab route when redirect=true but cannot go back for external url', () => {
    const navigationCannotGoBack = { ...createNavigationPropMock(), canGoBack: () => false }
    mocked(useNavigation).mockImplementationOnce(() => navigationCannotGoBack as never)

    renderMockComponent(
      { route: CATEGORIES_ROUTE, cityContentPath: '/peekingCity/ro/willkommen', cityCode: 'peekingCity', languageCode },
      true,
    )
    act(() => jest.runAllTimers())
    expect(navigationCannotGoBack.pop).not.toHaveBeenCalled()
    expect(navigationCannotGoBack.replace).toHaveBeenCalledWith(BOTTOM_TAB_NAVIGATION_ROUTE, {
      screen: CATEGORIES_TAB_ROUTE,
      params: { screen: CATEGORIES_ROUTE },
    })
    expect(openExternalUrl).toHaveBeenCalledTimes(1)
  })

  it('should do nothing when routeInformation is null', () => {
    renderMockComponent(null as unknown as RouteInformationType)
    expect(navigation.push).not.toHaveBeenCalled()
    expect(navigation.replace).not.toHaveBeenCalled()
    expect(navigateNested).not.toHaveBeenCalled()
    expect(openExternalUrl).not.toHaveBeenCalled()
  })
})
