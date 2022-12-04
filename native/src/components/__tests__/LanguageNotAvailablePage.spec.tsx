import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import { LanguageModelBuilder } from 'api-client'

import render from '../../testing/render'
import LanguageNotAvailablePage from '../LanguageNotAvailablePage'

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

describe('LanguageNotAvailablePage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const languages = new LanguageModelBuilder(3).build()
  const changeLanguage = jest.fn()

  it('should render', () => {
    const { getByText } = render(<LanguageNotAvailablePage availableLanguages={languages} />)

    expect(getByText('languageNotAvailable')).toBeTruthy()
    expect(getByText('chooseALanguage')).toBeTruthy()
    languages.forEach(language => {
      expect(getByText(language.name)).toBeTruthy()
    })
  })

  it('should call onPress if enabled', () => {
    const { getByText } = render(<LanguageNotAvailablePage availableLanguages={languages} />)

    fireEvent.press(getByText(languages[2]!.name))

    expect(changeLanguage).toHaveBeenCalledTimes(1)
    expect(changeLanguage).toHaveBeenCalledWith(languages[2]!.code)
  })
})
