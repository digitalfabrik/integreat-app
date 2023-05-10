import { fireEvent, waitFor } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React, { ReactElement } from 'react'
import { Share, Text, View } from 'react-native'

import { CATEGORIES_ROUTE, LanguageModel, LanguageModelBuilder, SEARCH_ROUTE, SHARE_SIGNAL_NAME } from 'api-client'
import CityModelBuilder from 'api-client/src/testing/CityModelBuilder'

import { AppContext } from '../../contexts/AppContextProvider'
import useSnackbar from '../../hooks/useSnackbar'
import navigateToLanguageChange from '../../navigation/navigateToLanguageChange'
import createNavigationMock from '../../testing/createNavigationPropMock'
import render from '../../testing/render'
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
    ({ items, overflowItems }: { items: ReactElement; overflowItems: ReactElement }) =>
      (
        <View>
          {items}
          {overflowItems}
        </View>
      )
)
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => `t_${key}`,
  }),
}))
jest.mock('@react-navigation/elements', () => ({
  HeaderBackButton: ({ onPress }: { onPress: () => void }) => <Text onPress={onPress}>HeaderBackButton</Text>,
}))
jest.mock('../../navigation/navigateToLanguageChange')
jest.mock('@react-native-community/netinfo')
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

describe('Header', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const t = (key: string) => `t_${key}`
  const cityModels = new CityModelBuilder(1).build()
  const cityModel = cityModels[0]!
  const languageModels = new LanguageModelBuilder(3).build()
  const languageModel = languageModels[0]!
  const defaultAvailableLanguages = ['de', 'en']
  const defaultShareUrl = 'https://example.com/share'
  const route = {
    key: 'key-0',
    name: CATEGORIES_ROUTE,
  }
  const navigation = createNavigationMock()

  const context = {
    changeCityCode: jest.fn(),
    changeLanguageCode: jest.fn(),
    cityCode: cityModel.code,
    languageCode: languageModel.code,
  }

  const renderHeader = ({
    showItems = true,
    availableLanguages = defaultAvailableLanguages,
    languages = languageModels,
    shareUrl = defaultShareUrl,
    isHome = false,
  }: {
    showItems?: boolean
    languages?: LanguageModel[]
    availableLanguages?: string[]
    shareUrl?: string
    isHome?: boolean | null
  }) =>
    render(
      <AppContext.Provider value={context}>
        <Header
          navigation={navigation}
          route={route}
          isHome={isHome}
          availableLanguages={availableLanguages}
          languages={languages}
          shareUrl={shareUrl}
          showItems={showItems}
        />
      </AppContext.Provider>
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
    expect(navigation.navigate).toHaveBeenCalledWith(SEARCH_ROUTE)
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
    const { getByText } = renderHeader({ isHome: false })
    fireEvent.press(getByText('HeaderBackButton'))
    expect(navigation.goBack).toHaveBeenCalledTimes(1)
  })

  it('should not show back button if it is the home', () => {
    const { queryByText } = renderHeader({ isHome: true })
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

    expect(share).toHaveBeenCalledWith({ message: t('shareMessage'), title: 'Integreat' })
    expect(sendTrackingSignal).toHaveBeenCalledWith({
      signal: { name: SHARE_SIGNAL_NAME, url: 'https://example.com/share' },
    })

    expect(showSnackbar).toHaveBeenCalledWith({ text: 'generalError' })
  })
})
