// @flow

import 'react-native'
import { render, wait } from '@testing-library/react-native'
import React from 'react'
import I18nProvider from '../I18nProvider'
import createAppSettings from '../../../settings/__tests__/createAppSettings'

describe('I18nProvider', () => {
  it('should transform the resources correctly', () => {
    const input = {
      'module1': {
        'language1': {
          'key1': 'lang1-translated1'
        },
        'language2': {
          'key1': 'lang2-translated1'
        }
      },
      'module2': {
        'language1': {
          'key2': 'lang1-translated2'
        },
        'language2': {
          'key2': 'lang2-translated2'
        }
      }
    }
    expect(I18nProvider.transformResources(input)).toMatchSnapshot()
  })

  it('should set content language if not yet set', async () => {
    const mockGetLocale = () => 'de_De'
    const mockAppSettingsSetContentLanguage = jest.fn(() => Promise.resolve())
    const initialAppSettings = createAppSettings({
      loadContentLanguage: () => Promise.resolve(undefined),
      setContentLanguage: mockAppSettingsSetContentLanguage
    })
    const mockSetContentLanguage = jest.fn()

    render(<I18nProvider setContentLanguage={mockSetContentLanguage}
                         getLocale={mockGetLocale}
                         appSettings={initialAppSettings} />)
    await wait(() => expect(mockSetContentLanguage).toHaveBeenCalledTimes(1))
    await wait(() => expect(mockSetContentLanguage).toHaveBeenCalledWith('de'))
    await wait(() => expect(mockAppSettingsSetContentLanguage).toHaveBeenCalledTimes(1))
    await wait(() => expect(mockAppSettingsSetContentLanguage).toHaveBeenCalledWith('de'))
  })
})
