import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import { LanguageModelBuilder } from 'api-client'

import { AppContext } from '../../contexts/AppContextProvider'
import render from '../../testing/render'
import LanguageNotAvailablePage from '../LanguageNotAvailablePage'

jest.mock('../../hooks/useLoadCities', () => () => ({
  data: null,
  loading: false,
  error: null,
  refresh: () => null,
}))
jest.mock('react-i18next')

describe('LanguageNotAvailablePage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const languages = new LanguageModelBuilder(3).build()
  const changeCityCode = jest.fn()
  const changeLanguageCode = jest.fn()
  const cityCode = 'ansbach'
  const languageCode = 'de'
  const context = { changeCityCode, changeLanguageCode, cityCode, languageCode }

  const renderLanguageNotAvailablePage = () =>
    render(
      <AppContext.Provider value={context}>
        <LanguageNotAvailablePage availableLanguages={languages} />
      </AppContext.Provider>
    )

  it('should render', () => {
    const { getByText } = renderLanguageNotAvailablePage()

    expect(getByText('languageNotAvailable')).toBeTruthy()
    expect(getByText('chooseALanguage')).toBeTruthy()
    languages.forEach(language => {
      expect(getByText(language.name)).toBeTruthy()
    })
  })

  it('should call onPress if enabled', () => {
    const { getByText } = renderLanguageNotAvailablePage()

    fireEvent.press(getByText(languages[2]!.name))

    expect(changeLanguageCode).toHaveBeenCalledTimes(1)
    expect(changeLanguageCode).toHaveBeenCalledWith(languages[2]!.code)
  })
})
