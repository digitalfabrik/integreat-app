import { fireEvent } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'
import { useDispatch } from 'react-redux'

import { CHANGE_LANGUAGE_MODAL_ROUTE, ChangeLanguageModalRouteType, LanguageModelBuilder } from 'api-client'

import createNavigationScreenPropMock from '../../testing/createNavigationPropMock'
import render from '../../testing/render'
import ChangeLanguageModal from '../ChangeLanguageModal'

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}))
jest.mock('react-redux', () => ({
  useDispatch: jest.fn()
}))

describe('ChangeLanguageModal', () => {
  const mockDispatch = jest.fn()
  const mockUseDispatch = mocked(useDispatch)

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseDispatch.mockImplementation(() => mockDispatch)
  })

  const languages = new LanguageModelBuilder(3).build()
  const selectedLanguage = languages[0]!
  const unavailableLanguage = languages[1]!
  const availableLanguage = languages[2]!
  const availableLanguages = [selectedLanguage.code, availableLanguage.code]

  const route = {
    key: 'route-id-0',
    params: {
      languages,
      availableLanguages,
      cityCode: 'augsburg',
      currentLanguage: selectedLanguage.code,
      previousKey: 'route-id-2'
    },
    name: CHANGE_LANGUAGE_MODAL_ROUTE
  }
  const navigation = createNavigationScreenPropMock<ChangeLanguageModalRouteType>()

  it('should change language if language is available and not selected', () => {
    const { getByText } = render(<ChangeLanguageModal route={route} navigation={navigation} />)

    fireEvent.press(getByText(availableLanguage.name))

    expect(navigation.goBack).toHaveBeenCalledTimes(1)
    expect(mockDispatch).toHaveBeenCalledTimes(1)
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SWITCH_CONTENT_LANGUAGE',
      params: {
        newLanguage: availableLanguage.code,
        city: 'augsburg'
      }
    })
  })

  it('should only navigate back if language is currently selected', () => {
    const { getByText } = render(<ChangeLanguageModal route={route} navigation={navigation} />)

    fireEvent.press(getByText(selectedLanguage.name))

    expect(navigation.goBack).toHaveBeenCalledTimes(1)
    expect(mockDispatch).not.toHaveBeenCalled()
  })

  it('should do nothing if language is neither available nor selected', () => {
    const { getByText } = render(<ChangeLanguageModal route={route} navigation={navigation} />)

    fireEvent.press(getByText(unavailableLanguage.name))

    expect(navigation.goBack).not.toHaveBeenCalled()
    expect(mockDispatch).not.toHaveBeenCalled()
  })
})
