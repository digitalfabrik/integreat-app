// @flow

import { render } from '@testing-library/react-native'
import React from 'react'
import type { TFunction } from 'react-i18next'
import { withTranslation } from 'react-i18next'
import waitForExpect from 'wait-for-expect'
import AppSettings from '../../../settings/AppSettings'
import AsyncStorage from '@react-native-community/async-storage'
import { Text } from 'react-native'

jest.mock('@react-native-community/async-storage')
jest.mock('../../../i18n/LanguageDetector')
jest.mock('../../loadTranslations')

describe('I18nProvider', () => {
  beforeEach(async () => {
    await AsyncStorage.clear()
  })

  it('should set content language if not yet set', async () => {
    const I18nProvider = require('../I18nProvider').default

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
    const I18nProvider = require('../I18nProvider').default

    const appSettings = new AppSettings()
    await appSettings.setContentLanguage('de')
    const mockSetContentLanguage = jest.fn()

    render(<I18nProvider setContentLanguage={mockSetContentLanguage} />)

    await waitForExpect(async () => {
      expect(mockSetContentLanguage).toHaveBeenCalledWith('de')
      expect(await appSettings.loadContentLanguage()).toBe('de')
    })
  })

  it('should initialize correct i18next instance', async () => {
    const I18nProvider = require('../I18nProvider').default

    const ReceivingComponent = withTranslation('app')(
      ({ t, i18n }) => {
        const transformedResources = require('../../loadTranslations').default()
        const languages = Object.keys(transformedResources)

        const resources = languages.reduce((resources, language: string) => {
          resources[language] = i18n.getDataByLanguage(language)
          return resources
        }, {})

        expect(resources).toEqual(transformedResources)
        expect(i18n.language).toEqual('en')
        expect(i18n.languages).toEqual(['en', 'de'])
        return <Text>{t('metaDescription')}</Text>
      }
    )

    const { queryByText } = render(
      <I18nProvider setContentLanguage={() => {}}>
        <ReceivingComponent />
      </I18nProvider>
    )

    await waitForExpect(async () => expect(
      queryByText('Integreat ist Ihr digitaler Guide für Deutschland. Finden Sie lokale Informationen, ' +
        'Veranstaltungen und Beratung. Immer aktuell und in Ihrer Sprache.')).toBeTruthy())
  })

  it('should show error if loading fails', async () => {
    const I18nProvider = require('../I18nProvider').default

    const mock = AsyncStorage.multiGet
    mock.mockImplementation(() => {
      throw Error('An Error occurred while getting settings!')
    })

    const { queryByText } = render(
      <I18nProvider setContentLanguage={() => {}}>
        <></>
      </I18nProvider>)

    await waitForExpect(() => {
      expect(queryByText('An Error occurred while getting settings!')).not.toBeNull()
    })

    mock.mockRestore()
  })

  it('should use fallback if language is invalid or unknown', async () => {
    const I18nProvider = require('../I18nProvider').default

    const ReceivingComponent = withTranslation('app')(
      ({ t }: { t: TFunction }) => {
        return <Text>{t('metaDescription', { lng: 'XX' })}</Text>
      }
    )

    const { queryByText } = render(
      <I18nProvider setContentLanguage={() => {}}>
        <ReceivingComponent />
      </I18nProvider>
    )

    await waitForExpect(() =>
      expect(
        queryByText(
          'Integreat ist Ihr digitaler Guide für Deutschland. ' +
          'Finden Sie lokale Informationen, Veranstaltungen und Beratung. ' +
          'Immer aktuell und in Ihrer Sprache.'
        )
      ).toBeTruthy()
    )
  })
})
