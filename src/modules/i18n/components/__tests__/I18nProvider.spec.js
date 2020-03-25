// @flow

import { render } from '@testing-library/react-native'
import React from 'react'
import I18nProvider from '../I18nProvider'
import type { TFunction } from 'react-i18next'
import { withTranslation } from 'react-i18next'
import localesResources from '../../../../../locales/locales.json'
import waitForExpect from 'wait-for-expect'
import AppSettings from '../../../settings/AppSettings'
import AsyncStorage from '@react-native-community/async-storage'
import { Text } from 'react-native'

jest.mock('@react-native-community/async-storage')
jest.mock('../../../i18n/LanguageDetector')

describe('I18nProvider', () => {
  beforeEach(async () => {
    await AsyncStorage.clear()
  })

  it('should transform the resources correctly', () => {
    const input = {
      module1: {
        language1: {
          key1: 'lang1-translated1'
        },
        language2: {
          key1: 'lang2-translated1'
        }
      },
      module2: {
        language1: {
          key2: 'lang1-translated2'
        },
        language2: {
          key2: 'lang2-translated2'
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
      expect(mockSetContentLanguage).toHaveBeenCalledWith('en')
      expect(await appSettings.loadContentLanguage()).toBe('en')
    })
  })

  it('should not use ui language as content language if already set', async () => {
    const appSettings = new AppSettings()
    await appSettings.setContentLanguage('de')
    const mockSetContentLanguage = jest.fn()

    render(<I18nProvider setContentLanguage={mockSetContentLanguage} />)

    await waitForExpect(async () => {
      expect(mockSetContentLanguage).toHaveBeenCalledWith('de')
      expect(await appSettings.loadContentLanguage()).toBe('de')
    })
  })

  it('should initialize correct i18next instance', () => {
    const ReceivingComponent = withTranslation('common')(
      ({ t, i18n }) => {
        const transformedResources = I18nProvider.transformResources(localesResources)
        const languages = Object.keys(transformedResources)

        const resources = languages.reduce((resources, language: string) => {
          resources[language] = i18n.getDataByLanguage(language)
          return resources
        }, {})

        expect(resources).toEqual(transformedResources)
        expect(i18n.language).toEqual('en')
        expect(i18n.languages).toEqual(['en', 'de'])
        return <Text>{t('chooseALanguage')}</Text>
      }
    )

    const { queryByText } = render(
      <I18nProvider setContentLanguage={() => {}}>
        <ReceivingComponent />
      </I18nProvider>
    )

    waitForExpect(async () => expect(queryByText('Choose a language.')).toBeTruthy())
  })

  it('should show error if loading fails', async () => {
    const previous = AsyncStorage.multiGet
    previous.mockImplementation(() => {
      throw Error('An Error occurred while getting settings!')
    })

    const { queryByText } = render(
      <I18nProvider setContentLanguage={() => {}}>
        <></>
      </I18nProvider>)

    await waitForExpect(async () => {
      expect(queryByText('An Error occurred while getting settings!')).not.toBeNull()
    })

    previous.mockImplementation(previous)
  })

  it('should use fallback if language is invalid or unknown', () => {
    const ReceivingComponent = withTranslation('common')(
      ({ t }: { t: TFunction }) => {
        return <Text>{t('chooseALanguage', { lng: 'XX' })}</Text>
      }
    )

    const { queryByText } = render(
      <I18nProvider setContentLanguage={() => {}}>
        <ReceivingComponent />
      </I18nProvider>
    )

    waitForExpect(async () => expect(queryByText('Choose a language.')).toBeTruthy())
  })
})
