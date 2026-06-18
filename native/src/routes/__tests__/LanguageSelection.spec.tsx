import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import { LANGUAGES_ROUTE, LanguagesRouteType } from 'shared'
import { LanguageModelBuilder } from 'shared/api'

import TestingAppContext from '../../testing/TestingAppContext'
import createNavigationScreenPropMock from '../../testing/createNavigationPropMock'
import render from '../../testing/render'
import LanguageSelection from '../LanguageSelection'

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

describe('LanguageSelection', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const languages = new LanguageModelBuilder(3).build()
  const selectedLanguage = languages[0]!
  const unavailableLanguage = languages[1]!
  const availableLanguage = languages[2]!
  const availableLanguages = [selectedLanguage.code, availableLanguage.code]

  const changeLanguageCode = jest.fn()
  const languageCode = selectedLanguage.code

  const route = {
    key: 'route-id-0',
    params: {
      languages,
      availableLanguages,
    },
    name: LANGUAGES_ROUTE,
  }
  const navigation = createNavigationScreenPropMock<LanguagesRouteType>()

  const renderLanguageSelection = () =>
    render(
      <TestingAppContext languageCode={languageCode} changeLanguageCode={changeLanguageCode}>
        <LanguageSelection route={route} navigation={navigation} />
      </TestingAppContext>,
    )

  it('should change language if language is available and not selected', () => {
    const { getByText } = renderLanguageSelection()

    fireEvent.press(getByText(availableLanguage.name))

    expect(navigation.goBack).toHaveBeenCalledTimes(1)
    expect(changeLanguageCode).toHaveBeenCalledTimes(1)
    expect(changeLanguageCode).toHaveBeenCalledWith(availableLanguage.code)
  })

  it('should only navigate back if language is currently selected', () => {
    const { getByText } = renderLanguageSelection()

    fireEvent.press(getByText(selectedLanguage.name))

    expect(navigation.goBack).toHaveBeenCalledTimes(1)
    expect(changeLanguageCode).not.toHaveBeenCalled()
  })

  it('should open unavailable dialog if language is neither available nor selected', () => {
    const { getByText, queryByText } = renderLanguageSelection()

    expect(queryByText('noTranslation')).toBeNull()

    fireEvent.press(getByText(unavailableLanguage.name))

    expect(navigation.goBack).not.toHaveBeenCalled()
    expect(changeLanguageCode).not.toHaveBeenCalled()
    expect(getByText('noTranslation')).toBeTruthy()
  })
})
