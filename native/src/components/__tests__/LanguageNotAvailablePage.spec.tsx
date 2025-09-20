import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import { LanguageModelBuilder } from 'shared/api'

import TestingAppContext from '../../testing/TestingAppContext'
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
  const changeLanguageCode = jest.fn()

  const renderLanguageNotAvailablePage = () =>
    render(
      <TestingAppContext changeLanguageCode={changeLanguageCode}>
        <LanguageNotAvailablePage availableLanguages={languages} />
      </TestingAppContext>,
    )

  it('should render', () => {
    const { getByText } = renderLanguageNotAvailablePage()

    expect(getByText('notFound.language')).toBeTruthy()
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
