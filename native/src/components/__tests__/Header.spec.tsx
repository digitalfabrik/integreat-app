import { fireEvent, waitFor } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React, { ReactElement } from 'react'
import { Share, Text, View } from 'react-native'

import {
  CATEGORIES_ROUTE,
  CategoriesRouteType,
  DISCLAIMER_ROUTE,
  DisclaimerRouteType,
  NewsRouteType,
  POIS_ROUTE,
  PoisRouteType,
  SEARCH_ROUTE,
  SHARE_SIGNAL_NAME,
} from 'shared'
import { LanguageModelBuilder, CityModelBuilder, LanguageModel } from 'shared/api'

import { RouteProps } from '../../constants/NavigationTypes'
import useSnackbar from '../../hooks/useSnackbar'
import navigateToLanguageChange from '../../navigation/navigateToLanguageChange'
import TestingAppContext from '../../testing/TestingAppContext'
import createNavigationMock from '../../testing/createNavigationPropMock'
import render from '../../testing/render'
import cityShareName from '../../utils/cityShareName'
import sendTrackingSignal from '../../utils/sendTrackingSignal'
import Header from '../Header'

jest.mock('../../hooks/useSnackbar')
jest.mock('../../utils/sendTrackingSignal')
jest.mock('react-navigation-header-buttons', () => ({
  ...jest.requireActual('react-navigation-header-buttons'),
  HiddenItem: ({ title }: { title: string }) => <Text>hidden: {title}</Text>,
}))
jest.mock(
  '../CustomHeaderButtons',
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
jest.mock('@react-navigation/elements', () => ({
  ...jest.requireActual('@react-navigation/elements'),
  HeaderBackButton: ({ onPress }: { onPress: () => void }) => <Text onPress={onPress}>HeaderBackButton</Text>,
}))
jest.mock('styled-components')
jest.mock('../../navigation/navigateToLanguageChange')
jest.mock('@react-native-community/netinfo')
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

describe('Header', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

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
    route?: RouteProps<CategoriesRouteType | PoisRouteType | DisclaimerRouteType | NewsRouteType>
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
          cityName={cityShareName(cityModel)}
        />
      </TestingAppContext>,
    )

  it('search and language change buttons should be enabled and visible if showItems and all props available', async () => {
    const { getByLabelText } = renderHeader({
      showItems: true,
      languages: languageModels,
      availableLanguages: defaultAvailableLanguages,
    })
    expect(getByLabelText(t('search'))).toHaveStyle({ opacity: 1 })
    fireEvent.press(getByLabelText(t('search')))
    await waitFor(() => expect(navigation.navigate).toHaveBeenCalledTimes(1))
    expect(navigation.navigate).toHaveBeenCalledWith(SEARCH_ROUTE, { searchText: null })
    expect(getByLabelText(t('changeLanguage'))).toHaveStyle({ opacity: 1 })
    fireEvent.press(getByLabelText(t('changeLanguage')))
    await waitFor(() => expect(navigateToLanguageChange).toHaveBeenCalledTimes(1))
  })

  it('search and language change buttons should be disabled and invisible if showItems is false', () => {
    const { getByLabelText } = renderHeader({
      showItems: false,
      languages: languageModels,
      availableLanguages: defaultAvailableLanguages,
    })
    expect(getByLabelText(t('search'))).toHaveStyle({ opacity: 0 })
    fireEvent.press(getByLabelText(t('search')))
    expect(navigation.navigate).not.toHaveBeenCalled()
    expect(getByLabelText(t('changeLanguage'))).toHaveStyle({ opacity: 0 })
    fireEvent.press(getByLabelText(t('changeLanguage')))
    expect(navigateToLanguageChange).not.toHaveBeenCalled()
  })

  it('should show back button and navigate back on click', () => {
    mocked(navigation.canGoBack).mockImplementation(() => true)
    const { getByText } = renderHeader({})
    fireEvent.press(getByText('HeaderBackButton'))
    expect(navigation.goBack).toHaveBeenCalledTimes(1)
  })

  it('should not show back button if it is the home', () => {
    mocked(navigation.canGoBack).mockImplementation(() => false)
    const { queryByText } = renderHeader({})
    expect(queryByText('HeaderBackButton')).toBeFalsy()
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
    expect(navigateToLanguageChange).not.toHaveBeenCalled()
    await waitFor(() => expect(showSnackbar).toHaveBeenCalledWith({ text: 'layout:noTranslation' }))
    expect(showSnackbar).toHaveBeenCalledTimes(1)
  })

  it('should show snackbar if sharing fails', () => {
    const showSnackbar = jest.fn()
    mocked(useSnackbar).mockImplementation(() => showSnackbar)
    const share = jest.fn(() => {
      throw new Error('fail')
    })
    const spy = jest.spyOn(Share, 'share')
    spy.mockImplementation(share)

    const { getByText } = renderHeader({})

    fireEvent.press(getByText(`hidden: ${t('share')}`))

    expect(share).toHaveBeenCalledWith({
      message: `${t('shareMessage')}: ${defaultPageTitle} - ${cityShareName(cityModel)} ${defaultShareUrl}`,
      title: 'Integreat',
    })
    expect(sendTrackingSignal).toHaveBeenCalledWith({
      signal: { name: SHARE_SIGNAL_NAME, url: 'https://example.com/share' },
    })

    expect(showSnackbar).toHaveBeenCalledWith({ text: 'generalError' })
  })

  it('should create proper share message including page title', () => {
    const share = jest.fn()
    const spy = jest.spyOn(Share, 'share')
    spy.mockImplementation(share)
    const { getByText } = renderHeader({
      route: { key: 'key-0', name: CATEGORIES_ROUTE, params: { title: defaultPageTitle } },
    })
    fireEvent.press(getByText(`hidden: ${t('share')}`))

    expect(share).toHaveBeenCalledWith({
      message: `${t('shareMessage')}: ${defaultPageTitle} - ${cityShareName(cityModel)} ${defaultShareUrl}`,
      title: 'Integreat',
    })
    expect(sendTrackingSignal).toHaveBeenCalledWith({
      signal: { name: SHARE_SIGNAL_NAME, url: 'https://example.com/share' },
    })
  })

  it('should use the route name in the share message if no page title is set', () => {
    const share = jest.fn()
    const spy = jest.spyOn(Share, 'share')
    spy.mockImplementation(share)
    const { getByText } = renderHeader({
      route: { key: 'key-0', name: DISCLAIMER_ROUTE },
    })
    fireEvent.press(getByText(`hidden: ${t('share')}`))

    expect(share).toHaveBeenCalledWith({
      message: `${t('shareMessage')}: ${t('disclaimer')} - ${cityShareName(cityModel)} ${defaultShareUrl}`,
      title: 'Integreat',
    })
    expect(sendTrackingSignal).toHaveBeenCalledWith({
      signal: { name: SHARE_SIGNAL_NAME, url: 'https://example.com/share' },
    })
  })

  it('should remove the page title in the share message if it equals the city name', () => {
    const share = jest.fn()
    const spy = jest.spyOn(Share, 'share')
    spy.mockImplementation(share)
    const { getByText } = renderHeader({
      route: { key: 'key-0', name: POIS_ROUTE, params: { title: 'Stadt Augsburg' } },
    })
    fireEvent.press(getByText(`hidden: ${t('share')}`))

    expect(share).toHaveBeenCalledWith({
      message: `${t('shareMessage')}: ${cityShareName(cityModel)} ${defaultShareUrl}`,
      title: 'Integreat',
    })
    expect(sendTrackingSignal).toHaveBeenCalledWith({
      signal: { name: SHARE_SIGNAL_NAME, url: 'https://example.com/share' },
    })
  })
})
