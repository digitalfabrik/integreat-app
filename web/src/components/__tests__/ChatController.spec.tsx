import { fireEvent } from '@testing-library/react'
import { mocked } from 'jest-mock'
import React from 'react'

import { CityModelBuilder } from 'shared/api'
import { mockUseLoadFromEndpointWithData } from 'shared/api/endpoints/testing/mockUseLoadFromEndpoint'

import useLocalStorage from '../../hooks/useLocalStorage'
import { renderWithTheme } from '../../testing/render'
import ChatController from '../ChatController'

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: () => ({ t: (key: string) => key }),
  Trans: ({ i18nKey }: { i18nKey: string }) => i18nKey,
}))
jest.mock('shared/api', () => ({
  ...jest.requireActual('shared/api'),
  useLoadFromEndpoint: jest.fn(),
}))
jest.mock('../../hooks/useLocalStorage')

describe('ChatContainer', () => {
  mockUseLoadFromEndpointWithData({ messages: [] })
  const updateLocalStorageItem = jest.fn()
  const city = new CityModelBuilder(1).build()[0]!

  beforeEach(jest.clearAllMocks)

  it('should show privacy policy if not accepted yet', () => {
    const value = { testumgebung: true }
    mocked(useLocalStorage<Record<string, boolean>>).mockImplementation(() => ({ value, updateLocalStorageItem }))
    const { getByText, queryByText } = renderWithTheme(<ChatController city={city} language='de' />)
    expect(queryByText('conversationText')).toBeFalsy()
    expect(queryByText('conversationHelperText')).toBeFalsy()
    expect(getByText('privacyPolicyInformation')).toBeTruthy()
    fireEvent.click(getByText('common:privacyPolicy'))
    expect(updateLocalStorageItem).toHaveBeenCalledTimes(1)
    expect(updateLocalStorageItem).toHaveBeenCalledWith({ testumgebung: true, augsburg: true })
  })

  it('should directly show chat if privacy policy already accepted', () => {
    const value = { testumgebung: true, augsburg: true }
    mocked(useLocalStorage<Record<string, boolean>>).mockImplementation(() => ({ value, updateLocalStorageItem }))
    const { getByText, queryByText } = renderWithTheme(<ChatController city={city} language='de' />)
    expect(queryByText('privacyPolicyInformation')).toBeFalsy()
    expect(getByText('conversationText')).toBeTruthy()
    expect(getByText('conversationHelperText')).toBeTruthy()
    expect(updateLocalStorageItem).toHaveBeenCalledTimes(0)
  })
})
