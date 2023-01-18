import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import { CHANGE_LANGUAGE_MODAL_ROUTE, ChangeLanguageModalRouteType, LanguageModelBuilder } from 'api-client'

import { AppContext } from '../../contexts/AppContextProvider'
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

  const changeCityCode = jest.fn()
  const changeLanguageCode = jest.fn()
  const cityCode = 'ansbach'
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
      <AppContext.Provider value={{ changeCityCode, changeLanguageCode, cityCode, languageCode }}>
        <ChangeLanguageModal route={route} navigation={navigation} />
      </AppContext.Provider>
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
