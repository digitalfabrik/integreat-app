import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import { CHANGE_LANGUAGE_MODAL_ROUTE, ChangeLanguageModalRouteType } from 'shared'
import { LanguageModelBuilder } from 'shared/api'

import TestingAppContext from '../../testing/TestingAppContext'
import createNavigationScreenPropMock from '../../testing/createNavigationPropMock'
import render from '../../testing/render'
import ChangeLanguageModal from '../ChangeLanguageModal'

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

describe('ChangeLanguageModal', () => {
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
    name: CHANGE_LANGUAGE_MODAL_ROUTE,
  }
  const navigation = createNavigationScreenPropMock<ChangeLanguageModalRouteType>()

  const renderChangeLanguageModel = () =>
    render(
      <TestingAppContext languageCode={languageCode} changeLanguageCode={changeLanguageCode}>
        <ChangeLanguageModal route={route} navigation={navigation} />
      </TestingAppContext>,
    )

  it('should change language if language is available and not selected', () => {
    const { getByText } = renderChangeLanguageModel()

    fireEvent.press(getByText(availableLanguage.name))

    expect(navigation.goBack).toHaveBeenCalledTimes(1)
    expect(changeLanguageCode).toHaveBeenCalledTimes(1)
    expect(changeLanguageCode).toHaveBeenCalledWith(availableLanguage.code)
  })

  it('should only navigate back if language is currently selected', () => {
    const { getByText } = renderChangeLanguageModel()

    fireEvent.press(getByText(selectedLanguage.name))

    expect(navigation.goBack).toHaveBeenCalledTimes(1)
    expect(changeLanguageCode).not.toHaveBeenCalled()
  })

  it('should do nothing if language is neither available nor selected', () => {
    const { getByText } = renderChangeLanguageModel()

    fireEvent.press(getByText(unavailableLanguage.name))

    expect(navigation.goBack).not.toHaveBeenCalled()
    expect(changeLanguageCode).not.toHaveBeenCalled()
  })
})
