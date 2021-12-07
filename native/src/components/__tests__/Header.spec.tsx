import { fireEvent, render, waitFor } from '@testing-library/react-native'
import React from 'react'

import { SEARCH_ROUTE } from 'api-client'
import CityModelBuilder from 'api-client/src/testing/CityModelBuilder'

import mockStackHeaderProps from '../../testing/mockStackHeaderProps'
import wrapWithTheme from '../../testing/wrapWithTheme'
import Header from '../Header'

jest.mock('../../hooks/useSnackbar')
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => `t_${key}`
  })
}))
jest.mock('@react-navigation/elements', () => {
  const { Text } = require('react-native')

  return {
    HeaderBackButton: ({ onPress }: { onPress: () => void }) => <Text onPress={onPress}>HeaderBackButton</Text>
  }
})

describe('Header', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const t = (key: string) => `t_${key}`
  const goToLanguageChange = jest.fn()
  const dispatch = jest.fn()
  const [city] = new CityModelBuilder(1).build()

  const buildProps = (
    peeking: boolean,
    categoriesAvailable: boolean,
    mode: 'float' | 'screen',
    goToLanguageChange: () => void,
    routeIndex = 0
  ): React.ComponentProps<typeof Header> => ({
    ...mockStackHeaderProps({}, routeIndex),
    peeking,
    categoriesAvailable,
    goToLanguageChange,
    routeCityModel: city,
    language: 'de',
    shareUrl: 'testUrl',
    dispatch
  })

  it('search header button should be enabled and visible after loading was finished', async () => {
    const props = buildProps(false, true, 'screen', goToLanguageChange)
    const { getByLabelText } = render(<Header {...props} />, { wrapper: wrapWithTheme })
    expect(getByLabelText(t('search'))).toHaveStyle({ opacity: 1 })
    fireEvent.press(getByLabelText(t('search')))
    await waitFor(() => expect(props.navigation.navigate).toHaveBeenCalledTimes(1))
    expect(props.navigation.navigate).toHaveBeenCalledWith(SEARCH_ROUTE)
  })

  it('language header button should be enabled and visible after loading was finished', async () => {
    const { getByLabelText } = render(<Header {...buildProps(false, true, 'screen', goToLanguageChange)} />, {
      wrapper: wrapWithTheme
    })
    expect(getByLabelText(t('changeLanguage'))).toHaveStyle({ opacity: 1 })
    fireEvent.press(getByLabelText(t('changeLanguage')))
    await waitFor(() => expect(goToLanguageChange).toHaveBeenCalledTimes(1))
  })

  it('search header button should be disabled and invisible while loading', () => {
    const props = buildProps(true, true, 'screen', goToLanguageChange)
    const { getByLabelText } = render(<Header {...props} />, { wrapper: wrapWithTheme })
    expect(getByLabelText(t('search'))).toHaveStyle({ opacity: 0 })
    fireEvent.press(getByLabelText(t('search')))
    expect(props.navigation.navigate).not.toHaveBeenCalled()
  })

  it('language header button should be disabled and invisible while loading', () => {
    const { getByLabelText } = render(<Header {...buildProps(true, true, 'screen', goToLanguageChange)} />, {
      wrapper: wrapWithTheme
    })
    expect(getByLabelText(t('changeLanguage'))).toHaveStyle({ opacity: 0 })
    fireEvent.press(getByLabelText(t('changeLanguage')))
    expect(goToLanguageChange).not.toHaveBeenCalled()
  })

  it('should show back button and navigate back on click', () => {
    const props = buildProps(true, true, 'screen', goToLanguageChange, 1)
    const { getByText } = render(<Header {...props} />, { wrapper: wrapWithTheme })
    fireEvent.press(getByText('HeaderBackButton'))
    expect(props.navigation.goBack).toHaveBeenCalledTimes(1)
  })

  it('should not show back button if it is the only route', () => {
    const props = buildProps(true, true, 'screen', goToLanguageChange, 0)
    const { queryByText } = render(<Header {...props} />, { wrapper: wrapWithTheme })
    expect(queryByText('HeaderBackButton')).toBeFalsy()
  })
})
