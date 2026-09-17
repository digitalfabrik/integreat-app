import { fireEvent, waitFor } from '@testing-library/react-native'
import React, { ReactElement } from 'react'
import { View, Linking, Share } from 'react-native'

import {
  BOTTOM_TAB_ROUTE,
  CATEGORIES_ROUTE,
  CATEGORIES_TAB_ROUTE,
  CategoriesRouteType,
  EVENTS_TAB_ROUTE,
  LANGUAGES_ROUTE,
  IMPRINT_ROUTE,
  ImprintRouteType,
  NewsRouteType,
  PlacesRouteType,
  SEARCH_ROUTE,
} from 'shared'
import { LanguageModelBuilder, RegionModelBuilder, LanguageModel } from 'shared/api'

import { NavigatorIds, ROOT_NAVIGATOR_ID, TAB_NAVIGATOR_ID } from '../../constants'
import { RouteProps } from '../../constants/NavigationTypes'
import useSnackbar from '../../hooks/useSnackbar'
import TestingAppContext from '../../testing/TestingAppContext'
import createNavigationMock from '../../testing/createNavigationPropMock'
import render from '../../testing/render'
import Header from '../Header'

jest.mock('../../hooks/useSnackbar')
jest.mock(
  '../ActionButtons',
  () =>
    ({ items, overflowItems }: { items: ReactElement; overflowItems: ReactElement }) => (
      <View>
        {items}
        {overflowItems}
      </View>
    ),
)
jest.mock('styled-components')
jest.mock('@react-native-community/netinfo')
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')
jest.mock('../../utils/openExternalUrl', () => jest.fn(async () => undefined))

describe('Header', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  const spy = jest.spyOn(Share, 'share')
  spy.mockImplementation(jest.fn())

  const t = (key: string) => key
  const regionModels = new RegionModelBuilder(1).build()
  const regionModel = regionModels[0]!
  const languageModels = new LanguageModelBuilder(3).build()
  const languageModel = languageModels[0]!
  const defaultAvailableLanguages = ['de', 'en']
  const defaultPageTitle = 'Test Category'
  const defaultShareUrl = 'https://example.com/share'
  const defaultRoute = {
    key: 'key-0',
    name: CATEGORIES_ROUTE,
    params: { title: 'Test Category' },
  }
  const navigation = createNavigationMock()
  const { mocked } = jest
  const mockPreviousRoute = (hasPreviousRoute: boolean) => {
    mocked(navigation.getState).mockImplementation(() => ({
      key: 'stack-key',
      index: hasPreviousRoute ? 1 : 0,
      routeNames: hasPreviousRoute ? [CATEGORIES_ROUTE, CATEGORIES_ROUTE] : [CATEGORIES_ROUTE],
      routes: hasPreviousRoute
        ? [
            { key: 'key-1', name: CATEGORIES_ROUTE },
            { key: 'key-0', name: CATEGORIES_ROUTE },
          ]
        : [{ key: 'key-0', name: CATEGORIES_ROUTE }],
      type: 'stack',
      stale: false,
      preloadedRoutes: [],
    }))
  }

  const mockParentNavigator = (navigatorId: NavigatorIds, state: Record<string, unknown>) => {
    mocked(navigation.getParent).mockImplementation(id =>
      id === navigatorId ? ({ getState: jest.fn(() => state) } as never) : undefined,
    )
  }

  const renderHeader = ({
    showItems = true,
    availableLanguages = defaultAvailableLanguages,
    languages = languageModels,
    shareUrl = defaultShareUrl,
    route = defaultRoute,
  }: {
    showItems?: boolean
    languages?: LanguageModel[]
    availableLanguages?: string[]
    shareUrl?: string
    route?: RouteProps<CategoriesRouteType | PlacesRouteType | ImprintRouteType | NewsRouteType>
  }) =>
    render(
      <TestingAppContext regionCode={regionModel.code} languageCode={languageModel.code}>
        <Header
          navigation={navigation}
          route={route}
          availableLanguages={availableLanguages}
          languages={languages}
          shareUrl={shareUrl}
          showItems={showItems}
          regionName={regionModel.name}
        />
      </TestingAppContext>,
    )

  it('search and language change buttons should be enabled and visible if showItems and all props available', async () => {
    const { getByLabelText } = renderHeader({
      showItems: true,
      languages: languageModels,
      availableLanguages: defaultAvailableLanguages,
    })
    fireEvent.press(getByLabelText(t('search:title')))
    await waitFor(() => expect(navigation.navigate).toHaveBeenCalledTimes(1))
    expect(navigation.navigate).toHaveBeenCalledWith(SEARCH_ROUTE, { searchText: null })

    fireEvent.press(getByLabelText(t('languages:change')))
    await waitFor(() => expect(navigation.navigate).toHaveBeenCalledTimes(2))
    expect(navigation.navigate).toHaveBeenCalledWith(LANGUAGES_ROUTE, {
      availableLanguages: defaultAvailableLanguages,
      languages: languageModels,
      routeType: CATEGORIES_ROUTE,
      slug: undefined,
    })
  })

  it('search and language change buttons should be disabled and invisible if showItems is false', () => {
    const { queryByLabelText } = renderHeader({
      showItems: false,
      languages: languageModels,
      availableLanguages: defaultAvailableLanguages,
    })
    expect(queryByLabelText(t('search:title'))).toBeNull()
    expect(queryByLabelText(t('languages:change'))).toBeNull()
  })

  it('should show back button and navigate back on click', () => {
    mockPreviousRoute(true)
    const { getByLabelText } = renderHeader({})
    fireEvent.press(getByLabelText('common:actions.back'))
    expect(navigation.goBack).toHaveBeenCalledTimes(1)
  })

  it('should show the title of the focused route of a nested navigator as header title', () => {
    mocked(navigation.getState).mockImplementation(() => ({
      key: 'stack-key',
      index: 1,
      routeNames: [BOTTOM_TAB_ROUTE, IMPRINT_ROUTE],
      routes: [
        {
          key: 'bottom-tab-key',
          name: BOTTOM_TAB_ROUTE,
          params: { title: regionModel.name },
          state: {
            index: 0,
            routes: [
              {
                key: 'categories-tab-key',
                name: CATEGORIES_TAB_ROUTE,
                state: {
                  index: 1,
                  routes: [
                    { key: 'categories-key-0', name: CATEGORIES_ROUTE, params: { title: regionModel.name } },
                    { key: 'categories-key-1', name: CATEGORIES_ROUTE, params: { title: 'Nested Category' } },
                  ],
                },
              },
            ],
          },
        },
        { key: 'key-0', name: IMPRINT_ROUTE },
      ],
      type: 'stack',
      stale: false,
      preloadedRoutes: [],
    }))
    const { getByText } = renderHeader({ route: { key: 'key-0', name: IMPRINT_ROUTE, params: {} } })
    expect(getByText('Nested Category')).toBeTruthy()
  })

  it('should not show back button if it is the home', () => {
    mockPreviousRoute(false)
    const { queryByLabelText } = renderHeader({})
    expect(queryByLabelText('common:actions.back')).toBeFalsy()
  })

  it('should show location change button even when tab history exists', () => {
    mockPreviousRoute(false)
    mockParentNavigator(TAB_NAVIGATOR_ID, {
      index: 1,
      routes: [
        { key: 'tab-key-0', name: CATEGORIES_TAB_ROUTE },
        { key: 'tab-key-1', name: EVENTS_TAB_ROUTE },
      ],
    })
    const { getByLabelText } = renderHeader({})
    expect(getByLabelText('Stadt Augsburg regions:change')).toBeTruthy()
  })

  it('should show the title of the previous root route if the current stack has no history', () => {
    mockPreviousRoute(false)
    mockParentNavigator(ROOT_NAVIGATOR_ID, {
      index: 1,
      routes: [
        { key: 'search-key', name: SEARCH_ROUTE, params: { title: 'search:title' } },
        { key: 'bottom-tab-key', name: BOTTOM_TAB_ROUTE },
      ],
    })
    const { getByText, queryByLabelText } = renderHeader({})
    expect(getByText('search:title')).toBeTruthy()
    expect(queryByLabelText('Stadt Augsburg regions:change')).toBeNull()
  })

  it('should not open language change modal if no translation available', async () => {
    const showSnackbar = jest.fn()
    mocked(useSnackbar).mockImplementation(() => showSnackbar)
    const { getByLabelText } = renderHeader({
      showItems: true,
      languages: languageModels,
      availableLanguages: [languageModel.code],
    })
    fireEvent.press(getByLabelText(t('languages:change')))
    expect(navigation.navigate).not.toHaveBeenCalled()
    await waitFor(() => expect(showSnackbar).toHaveBeenCalledWith({ text: 'languages:error.noTranslation' }))
    expect(showSnackbar).toHaveBeenCalledTimes(1)
  })

  it('should show snackbar if sharing fails', () => {
    const showSnackbar = jest.fn()
    mocked(useSnackbar).mockImplementation(() => showSnackbar)

    spy.mockImplementationOnce(
      jest.fn(() => {
        throw new Error('fail')
      }),
    )

    const { getByTestId, getByText } = renderHeader({})

    fireEvent.press(getByTestId('header-overflow-menu-button'))
    fireEvent.press(getByText(t('share:title')))

    expect(Share.share).toHaveBeenCalled()

    expect(showSnackbar).toHaveBeenCalledWith({ text: 'error:unknownError' })
  })

  it('should create proper share message including page title', () => {
    const { getByTestId, getByText } = renderHeader({
      route: { key: 'key-0', name: CATEGORIES_ROUTE, params: { title: defaultPageTitle } },
    })
    fireEvent.press(getByTestId('header-overflow-menu-button'))
    fireEvent.press(getByText(t('share:title')))

    expect(Share.share).toHaveBeenCalledWith({
      message: 'share:message Test Category - Stadt Augsburg\nhttps://example.com/share',
      title: 'Test Category - Stadt Augsburg',
    })
  })

  it('should use the region name in the share message if no route title is set', () => {
    const openURL = jest.fn()
    const spy = jest.spyOn(Linking, 'openURL')
    spy.mockImplementation(openURL)
    const { getByTestId, getByText } = renderHeader({
      route: { key: 'key-0', name: IMPRINT_ROUTE },
    })
    fireEvent.press(getByTestId('header-overflow-menu-button'))
    fireEvent.press(getByText(t('share:title')))

    expect(Share.share).toHaveBeenCalledWith({
      message: 'share:message Stadt Augsburg\nhttps://example.com/share',
      title: 'Stadt Augsburg',
    })
  })

  it('should not add the region name in the share message if it equals the route title', () => {
    const openURL = jest.fn()
    const spy = jest.spyOn(Linking, 'openURL')
    spy.mockImplementation(openURL)
    const { getByTestId, getByText } = renderHeader({
      route: { key: 'key-0', name: CATEGORIES_ROUTE, params: { title: 'Stadt Augsburg' } },
    })
    fireEvent.press(getByTestId('header-overflow-menu-button'))
    fireEvent.press(getByText(t('share:title')))

    expect(Share.share).toHaveBeenCalledWith({
      message: 'share:message Stadt Augsburg\nhttps://example.com/share',
      title: 'Stadt Augsburg',
    })
  })

  it('should use the route title in the share message', () => {
    const openURL = jest.fn()
    const spy = jest.spyOn(Linking, 'openURL')
    spy.mockImplementation(openURL)
    const { getByTestId, getByText } = renderHeader({
      route: { key: 'key-0', name: CATEGORIES_ROUTE, params: { title: 'Willkommen' } },
    })
    fireEvent.press(getByTestId('header-overflow-menu-button'))
    fireEvent.press(getByText(t('share:title')))

    expect(Share.share).toHaveBeenCalledWith({
      message: 'share:message Willkommen - Stadt Augsburg\nhttps://example.com/share',
      title: 'Willkommen - Stadt Augsburg',
    })
  })
})
