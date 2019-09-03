// @flow

import 'react-native'
import { render, flushMicrotasksQueue } from '@testing-library/react-native'
import React from 'react'
import I18nProvider from '../I18nProvider'
import { I18nextProvider } from 'react-i18next'
import i18next from 'i18next'
import localesResources from '../../../../locales.json'
import TestRenderer from 'react-test-renderer'
import waitForExpect from 'wait-for-expect'
import AppSettings from '../../../settings/AppSettings'
import AsyncStorage from '@react-native-community/async-storage'

jest.mock('@react-native-community/async-storage')
jest.mock('../../../i18n/LanguageDetector')

describe('I18nProvider', () => {
  beforeEach(async () => {
    await AsyncStorage.clear()
  })

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
    const appSettings = new AppSettings()
    const mockSetContentLanguage = jest.fn()

    render(<I18nProvider setContentLanguage={mockSetContentLanguage} />)
    await waitForExpect(async () => {
      expect(mockSetContentLanguage).toHaveBeenCalledTimes(1)
      expect(mockSetContentLanguage).toHaveBeenCalledWith('en_US')
      expect(await appSettings.loadContentLanguage()).toBe('en_US')
    })
  })

  it('should not set content language if already set', () => {
    const appSettings = new AppSettings()
    appSettings.setContentLanguage('de')
    const mockSetContentLanguage = jest.fn()

    render(<I18nProvider setContentLanguage={mockSetContentLanguage} />)

    waitForExpect(async () => {
      expect(mockSetContentLanguage).not.toHaveBeenCalled()
      expect(await appSettings.loadContentLanguage()).toBe('de')
    })
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
      <I18nProvider setContentLanguage={() => {}}>
        <React.Fragment />
      </I18nProvider>
    ).root

    expect(i18next.createInstance).toHaveBeenCalledTimes(1)

    expect(root.findByType(I18nextProvider).props.i18n).toBe(i18nInstance)

    expect(i18nInstance.init).toHaveBeenCalledTimes(1)
    expect(i18nInstance.init.mock.calls[0]).toHaveLength(1)
    const options = i18nInstance.init.mock.calls[0][0]

    expect(options.resources).toEqual(I18nProvider.transformResources(localesResources))
    delete options.resources

    expect(options.fallbackLng).toEqual(['en', 'de'])
    expect(options.load).toBe('languageOnly')
    i18next.createInstance = unmockedCreateInstance
  })

  it('should show error if loading fails', async () => {
    AsyncStorage.getItem.mockImplementation(() => {
      throw Error('An Error occurred while getting settings!')
    })

    const { queryByText } = render(
      <I18nProvider setContentLanguage={() => {}}>
        <React.Fragment />
      </I18nProvider>)

    await waitForExpect(async () => {
      expect(queryByText('An Error occurred while getting settings!')).not.toBeNull()
    })
  })
})
