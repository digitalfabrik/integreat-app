import { fireEvent, waitFor } from '@testing-library/react-native'
import React, { ReactElement } from 'react'
import { View, Linking, Share } from 'react-native'

import {
  CATEGORIES_ROUTE,
  CategoriesRouteType,
  CHANGE_LANGUAGE_MODAL_ROUTE,
  IMPRINT_ROUTE,
  ImprintRouteType,
  NewsRouteType,
  POIS_ROUTE,
  PoisRouteType,
  SEARCH_ROUTE,
} from 'shared'
import { LanguageModelBuilder, CityModelBuilder, LanguageModel } from 'shared/api'

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
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, params: { message: string } | undefined) => (params ? `${key}: ${params.message}` : key),
  }),
}))
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
  const cityModels = new CityModelBuilder(1).build()
  const cityModel = cityModels[0]!
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
    route?: RouteProps<CategoriesRouteType | PoisRouteType | ImprintRouteType | NewsRouteType>
  }) =>
    render(
      <TestingAppContext cityCode={cityModel.code} languageCode={languageModel.code}>
        <Header
          navigation={navigation}
          route={route}
          availableLanguages={availableLanguages}
          languages={languages}
          shareUrl={shareUrl}
          showItems={showItems}
          cityName={cityModel.name}
        />
      </TestingAppContext>,
    )

  it('search and language change buttons should be enabled and visible if showItems and all props available', async () => {
    const { getByLabelText } = renderHeader({
      showItems: true,
      languages: languageModels,
      availableLanguages: defaultAvailableLanguages,
    })
    fireEvent.press(getByLabelText(t('search')))
    await waitFor(() => expect(navigation.navigate).toHaveBeenCalledTimes(1))
    expect(navigation.navigate).toHaveBeenCalledWith(SEARCH_ROUTE, { searchText: null })

    fireEvent.press(getByLabelText(t('changeLanguage')))
    await waitFor(() => expect(navigation.navigate).toHaveBeenCalledTimes(2))
    expect(navigation.navigate).toHaveBeenCalledWith(CHANGE_LANGUAGE_MODAL_ROUTE, {
      availableLanguages: defaultAvailableLanguages,
      languages: languageModels,
    })
  })

  it('search and language change buttons should be disabled and invisible if showItems is false', () => {
    const { queryByLabelText } = renderHeader({
      showItems: false,
      languages: languageModels,
      availableLanguages: defaultAvailableLanguages,
    })
    expect(queryByLabelText(t('search'))).toBeNull()
    expect(queryByLabelText(t('changeLanguage'))).toBeNull()
  })

  it('should show back button and navigate back on click', () => {
    mockPreviousRoute(true)
    const { getByLabelText } = renderHeader({})
    fireEvent.press(getByLabelText('back'))
    expect(navigation.goBack).toHaveBeenCalledTimes(1)
  })

  it('should not show back button if it is the home', () => {
    mockPreviousRoute(false)
    const { queryByLabelText } = renderHeader({})
    expect(queryByLabelText('back')).toBeFalsy()
  })

  it('should show location change button even when tab history exists', () => {
    mockPreviousRoute(false)
    mocked(navigation.getParent).mockReturnValue({
      getState: jest.fn(() => ({ history: [{ key: 'tab-key-0' }, { key: 'tab-key-1' }] })),
      getParent: jest.fn(() => {}),
    } as never)
    const { getByLabelText } = renderHeader({})
    expect(getByLabelText(/changeLocation/)).toBeTruthy()
  })

  it('should not open language change modal if no translation available', async () => {
    const showSnackbar = jest.fn()
    mocked(useSnackbar).mockImplementation(() => showSnackbar)
    const { getByLabelText } = renderHeader({
      showItems: true,
      languages: languageModels,
      availableLanguages: [languageModel.code],
    })
    fireEvent.press(getByLabelText(t('changeLanguage')))
    expect(navigation.navigate).not.toHaveBeenCalled()
    await waitFor(() => expect(showSnackbar).toHaveBeenCalledWith({ text: 'layout:noTranslation' }))
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
    fireEvent.press(getByText(t('share')))

    expect(Share.share).toHaveBeenCalled()

    expect(showSnackbar).toHaveBeenCalledWith({ text: 'generalError' })
  })

  it('should create proper share message including page title', () => {
    const { getByTestId, getByText } = renderHeader({
      route: { key: 'key-0', name: CATEGORIES_ROUTE, params: { title: defaultPageTitle } },
    })
    fireEvent.press(getByTestId('header-overflow-menu-button'))
    fireEvent.press(getByText(t('share')))

    expect(Share.share).toHaveBeenCalledWith({
      message: 'shareMessage: Test Category - Stadt Augsburg\nhttps://example.com/share',
      title: 'Test Category - Stadt Augsburg',
    })
  })

  it('should use the route name in the share message if no page title is set', () => {
    const openURL = jest.fn()
    const spy = jest.spyOn(Linking, 'openURL')
    spy.mockImplementation(openURL)
    const { getByTestId, getByText } = renderHeader({
      route: { key: 'key-0', name: IMPRINT_ROUTE },
    })
    fireEvent.press(getByTestId('header-overflow-menu-button'))
    fireEvent.press(getByText(t('share')))

    expect(Share.share).toHaveBeenCalledWith({
      message: 'shareMessage: imprint - Stadt Augsburg\nhttps://example.com/share',
      title: 'imprint - Stadt Augsburg',
    })
  })

  it('should remove the page title in the share message if it equals the city name', () => {
    const openURL = jest.fn()
    const spy = jest.spyOn(Linking, 'openURL')
    spy.mockImplementation(openURL)
    const { getByTestId, getByText } = renderHeader({
      route: { key: 'key-0', name: POIS_ROUTE, params: { title: 'Stadt Augsburg' } },
    })
    fireEvent.press(getByTestId('header-overflow-menu-button'))
    fireEvent.press(getByText(t('share')))

    expect(Share.share).toHaveBeenCalledWith({
      message: 'shareMessage: Stadt Augsburg\nhttps://example.com/share',
      title: 'Stadt Augsburg',
    })
  })
})
