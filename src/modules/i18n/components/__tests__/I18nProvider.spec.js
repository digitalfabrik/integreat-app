// @flow

import 'react-native'
import { render } from 'react-native-testing-library'
import React from 'react'
import I18nProvider from '../I18nProvider'
import createAppSettingsMock from '../../../test-utils/createAppSettingsMock'
import { I18nextProvider } from 'react-i18next'
import i18next from 'i18next'
import localesResources from '../../../../locales.json'
import TestRenderer from 'react-test-renderer'
import waitForExpect from 'wait-for-expect'

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
    const mockGetLocale = () => 'de_DE'
    const mockAppSettingsSetContentLanguage = jest.fn(() => Promise.resolve())
    const initialAppSettings = createAppSettingsMock({
      loadContentLanguage: () => Promise.resolve(undefined),
      setContentLanguage: mockAppSettingsSetContentLanguage
    })
    const mockSetContentLanguage = jest.fn()

    render(<I18nProvider setContentLanguage={mockSetContentLanguage}
                         getLocale={mockGetLocale}
                         appSettings={initialAppSettings} />)

    await waitForExpect(() => expect(mockSetContentLanguage).toHaveBeenCalledTimes(1))
    await waitForExpect(() => expect(mockSetContentLanguage).toHaveBeenCalledWith('de'))
    await waitForExpect(() => expect(mockAppSettingsSetContentLanguage).toHaveBeenCalledTimes(1))
    await waitForExpect(() => expect(mockAppSettingsSetContentLanguage).toHaveBeenCalledWith('de'))
  })

  it('should not set content language if already set', () => {
    const mockGetLocale = () => 'de_DE'
    const mockAppSettingsSetContentLanguage = jest.fn(() => Promise.resolve())
    const initialAppSettings = createAppSettingsMock({
      loadContentLanguage: () => Promise.resolve('en'),
      setContentLanguage: mockAppSettingsSetContentLanguage
    })
    const mockSetContentLanguage = jest.fn()

    render(<I18nProvider setContentLanguage={mockSetContentLanguage}
                         getLocale={mockGetLocale}
                         appSettings={initialAppSettings} />)

    expect(mockSetContentLanguage).not.toHaveBeenCalled()
    expect(mockAppSettingsSetContentLanguage).not.toHaveBeenCalled()
  })

  it('should initialize correct i18next instance', () => {
    const unmockedCreateInstance = i18next.createInstance.bind(i18next)
    const i18nInstance = unmockedCreateInstance()
    i18next.createInstance = jest.fn(() => {
      i18nInstance.init = jest.fn(i18nInstance.init)
      i18nInstance.use = jest.fn(i18nInstance.use)
      return i18nInstance
    })

    const root = TestRenderer.create(
      <I18nProvider setContentLanguage={() => {}}
                    getLocale={() => 'de_DE'}
                    appSettings={createAppSettingsMock({})}>
        <div />
      </I18nProvider>
    ).root

    expect(i18next.createInstance.mock.calls).toHaveLength(1)

    expect(root.findByType(I18nextProvider).props.i18n).toBe(i18nInstance)

    expect(i18nInstance.init.mock.calls).toHaveLength(1)
    expect(i18nInstance.init.mock.calls[0]).toHaveLength(1)
    const options = i18nInstance.init.mock.calls[0][0]

    expect(options.resources).toEqual(I18nProvider.transformResources(localesResources))
    delete options.resources

    expect(options).toMatchSnapshot()
    i18next.createInstance = unmockedCreateInstance
  })
})
