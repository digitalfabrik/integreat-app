import AsyncStorage from '@react-native-async-storage/async-storage'
import { render, waitFor } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import moment from 'moment'
import React, { useContext } from 'react'
import { Translation } from 'react-i18next'
import { Text } from 'react-native'

import DateFormatterContext from '../../contexts/DateFormatterContext'
import appSettings from '../../utils/AppSettings'
import NativeLanguageDetector from '../../utils/NativeLanguageDetector'
import { setSystemLanguage } from '../../utils/sendTrackingSignal'
import I18nProvider from '../I18nProvider'

jest.mock('../../utils/NativeLanguageDetector')
jest.mock('translations/src/loadTranslations')
jest.mock('../../utils/sendTrackingSignal')

const mockDetect = mocked(NativeLanguageDetector.detect)

describe('I18nProvider', () => {
  beforeEach(async () => {
    await AsyncStorage.clear()
    jest.clearAllMocks()
  })

  it('should set content language if not yet set', async () => {
    mockDetect.mockReturnValue('kmr')
    render(
      <I18nProvider>
        <Text>Hello</Text>
      </I18nProvider>
    )
    await waitFor(async () => expect(await appSettings.loadContentLanguage()).toBe('kmr'))
    expect(setSystemLanguage).toHaveBeenCalledTimes(1)
    expect(setSystemLanguage).toHaveBeenCalledWith('kmr')
  })

  it('should not set content language if already set', async () => {
    await appSettings.setContentLanguage('ar')
    mockDetect.mockReturnValue('kmr')
    render(
      <I18nProvider>
        <Text>Hello</Text>
      </I18nProvider>
    )
    expect(await appSettings.loadContentLanguage()).toBe('ar')
    await waitFor(() => expect(setSystemLanguage).toHaveBeenCalledTimes(1))
    expect(setSystemLanguage).toHaveBeenCalledWith('kmr')
  })

  it('should show error if loading fails', async () => {
    mockDetect.mockImplementation(() => {
      throw Error('An Error occurred while getting settings!')
    })
    const { getByText } = render(
      <I18nProvider>
        <Text>Content</Text>
      </I18nProvider>
    )
    await waitFor(() => getByText('An Error occurred while getting settings!'))
    expect(getByText('An Error occurred while getting settings!')).toBeTruthy()
    mockDetect.mockRestore()
  })

  it('should use fallbacks for ui translations', async () => {
    mockDetect.mockReturnValue('ku')
    const { getByText } = render(
      <I18nProvider>
        <Translation>{t => <Text>{t('dashboard:localInformation')}</Text>}</Translation>
      </I18nProvider>
    )
    await waitFor(() => expect(getByText('Zanyariyên xwecihî')).toBeTruthy())
  })

  it('should choose the default fallback for ui translations', async () => {
    mockDetect.mockReturnValue('en')
    const { getByText } = render(
      <I18nProvider>
        <Translation>{t => <Text>{t('dashboard:localInformation')}</Text>}</Translation>
      </I18nProvider>
    )
    await waitFor(() => getByText('Lokale Informationen'))
    expect(getByText('Lokale Informationen')).toBeTruthy()
  })

  it('should have formatter with german fallback format', async () => {
    const ReceivingComponent = () => {
      const formatter = useContext(DateFormatterContext)
      const formated = formatter.format(moment.utc('2020-12-21T14:58:57+01:00'), {})
      return <Text>{formated}</Text>
    }

    const { getByText } = render(
      <I18nProvider>
        <ReceivingComponent />
      </I18nProvider>
    )
    await waitFor(() => getByText('2020-12-21T13:58:57Z'))
    expect(getByText('2020-12-21T13:58:57Z')).toBeTruthy()
  })

  it('should use zh-CN if any chinese variant is chosen', async () => {
    mockDetect.mockReturnValue('zh-CN')
    const { getByText } = render(
      <I18nProvider>
        <Translation>{t => <Text>{t('dashboard:localInformation')}</Text>}</Translation>
      </I18nProvider>
    )
    await waitFor(() => getByText('本地信息'))
    expect(getByText('本地信息')).toBeTruthy()
  })

  it('should support language tags with dashes', async () => {
    mockDetect.mockReturnValue('zh-CN')
    const { getByText } = render(
      <I18nProvider>
        <Translation>{t => <Text>{t('dashboard:localInformation')}</Text>}</Translation>
      </I18nProvider>
    )
    await waitFor(() => getByText('本地信息'))
    expect(getByText('本地信息')).toBeTruthy()
  })

  it('should support de-DE and select de', async () => {
    mockDetect.mockReturnValue('de-DE')
    const { getByText, queryByText } = render(
      <I18nProvider>
        <Translation>{t => <Text>{t('dashboard:localInformation')}</Text>}</Translation>
        <Translation>{(t, { i18n }) => <Text>{i18n.languages[0]}</Text>}</Translation>
      </I18nProvider>
    )
    await waitFor(() => getByText('Lokale Informationen'))
    expect(getByText('Lokale Informationen')).toBeTruthy()
    expect(getByText('de')).toBeTruthy()
    expect(queryByText('de-DE')).toBeFalsy()
  })
})
