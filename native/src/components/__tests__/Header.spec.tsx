import { fireEvent, waitFor } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React, { ReactElement } from 'react'
import { Share, Text, View } from 'react-native'

import { CATEGORIES_ROUTE, SEARCH_ROUTE, SHARE_SIGNAL_NAME } from 'api-client'
import CityModelBuilder from 'api-client/src/testing/CityModelBuilder'

import useSnackbar from '../../hooks/useSnackbar'
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
  '../MaterialHeaderButtons',
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

describe('Header', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const t = (key: string) => `t_${key}`
  const goToLanguageChange = jest.fn()
  const [city] = new CityModelBuilder(1).build()

  const buildProps = (
    peeking: boolean,
    categoriesAvailable: boolean,
    goToLanguageChange: () => void,
    routeIndex = 0
  ): React.ComponentProps<typeof Header> => ({
    navigation: createNavigationMock(routeIndex),
    route: {
      key: 'key-0',
      name: CATEGORIES_ROUTE,
      params: {
        shareUrl: 'https://example.com/share',
      },
    },
    peeking,
    categoriesAvailable,
    goToLanguageChange,
    routeCityModel: city,
    language: 'de',
  })

  it('search header button should be enabled and visible after loading was finished', async () => {
    const props = buildProps(false, true, goToLanguageChange)
    const { getByLabelText } = render(<Header {...props} />)
    expect(getByLabelText(t('search'))).toHaveStyle({ opacity: 1 })
    fireEvent.press(getByLabelText(t('search')))
    await waitFor(() => expect(props.navigation.navigate).toHaveBeenCalledTimes(1))
    expect(props.navigation.navigate).toHaveBeenCalledWith(SEARCH_ROUTE)
  })

  it('language header button should be enabled and visible after loading was finished', async () => {
    const { getByLabelText } = render(<Header {...buildProps(false, true, goToLanguageChange)} />)
    expect(getByLabelText(t('changeLanguage'))).toHaveStyle({ opacity: 1 })
    fireEvent.press(getByLabelText(t('changeLanguage')))
    await waitFor(() => expect(goToLanguageChange).toHaveBeenCalledTimes(1))
  })

  it('search header button should be disabled and invisible while loading', () => {
    const props = buildProps(true, true, goToLanguageChange)
    const { getByLabelText } = render(<Header {...props} />)
    expect(getByLabelText(t('search'))).toHaveStyle({ opacity: 0 })
    fireEvent.press(getByLabelText(t('search')))
    expect(props.navigation.navigate).not.toHaveBeenCalled()
  })

  it('language header button should be disabled and invisible while loading', () => {
    const { getByLabelText } = render(<Header {...buildProps(true, true, goToLanguageChange)} />)
    expect(getByLabelText(t('changeLanguage'))).toHaveStyle({ opacity: 0 })
    fireEvent.press(getByLabelText(t('changeLanguage')))
    expect(goToLanguageChange).not.toHaveBeenCalled()
  })

  it('should show back button and navigate back on click', () => {
    const props = buildProps(true, true, goToLanguageChange, 1)
    const { getByText } = render(<Header {...props} />)
    fireEvent.press(getByText('HeaderBackButton'))
    expect(props.navigation.goBack).toHaveBeenCalledTimes(1)
  })

  it('should not show back button if it is the only route', () => {
    const props = buildProps(true, true, goToLanguageChange, 0)
    const { queryByText } = render(<Header {...props} />)
    expect(queryByText('HeaderBackButton')).toBeFalsy()
  })

  it('should show snackbar if sharing fails', () => {
    const props = buildProps(true, true, goToLanguageChange)
    const showSnackbar = jest.fn()
    mocked(useSnackbar).mockImplementation(() => showSnackbar)
    const share = jest.fn(() => {
      throw new Error('fail')
    })
    const spy = jest.spyOn(Share, 'share')
    spy.mockImplementation(share)

    const { getByText } = render(<Header {...props} />)

    fireEvent.press(getByText(`hidden: ${t('share')}`))

    expect(share).toHaveBeenCalledWith({ message: t('shareMessage'), title: 'Integreat' })
    expect(sendTrackingSignal).toHaveBeenCalledWith({
      signal: { name: SHARE_SIGNAL_NAME, url: 'https://example.com/share' },
    })

    expect(showSnackbar).toHaveBeenCalledWith(t('generalError'))
  })
})
