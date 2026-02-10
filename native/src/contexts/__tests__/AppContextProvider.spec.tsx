import AsyncStorage from '@react-native-async-storage/async-storage'
import { fireEvent, waitFor } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React, { useContext } from 'react'
import { View } from 'react-native'
import { Button } from 'react-native-paper'

import { FeatureFlagsType } from 'build-configs/BuildConfigType'

import Text from '../../components/base/Text'
import buildConfig from '../../constants/buildConfig'
import render from '../../testing/render'
import appSettings, { defaultSettings, SettingsType } from '../../utils/AppSettings'
import defaultDataContainer from '../../utils/DefaultDataContainer'
import { subscribeNews, unsubscribeNews } from '../../utils/PushNotificationsManager'
import AppContextProvider, { AppContext } from '../AppContextProvider'

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ i18n: { languages: ['en'] } }),
}))
jest.mock('../../utils/PushNotificationsManager', () => ({
  subscribeNews: jest.fn(async () => undefined),
  unsubscribeNews: jest.fn(async () => undefined),
}))
jest.mock('../../utils/DefaultDataContainer', () => ({ storeLastUsage: jest.fn(async () => undefined) }))

describe('AppContextProvider', () => {
  const mockedBuildConfig = mocked(buildConfig)
  const previousBuildConfig = buildConfig()
  const setSettings = jest.spyOn(appSettings, 'setSettings')

  const mockBuildConfig = (featureFlags: Partial<FeatureFlagsType>) =>
    mockedBuildConfig.mockImplementation(() => ({
      ...previousBuildConfig,
      // @ts-expect-error passing only a partial of fixed city type leads to ts errors that are irrelevant for testing though
      featureFlags: { ...previousBuildConfig.featureFlags, ...featureFlags },
    }))

  const MockComponent = ({
    newCityCode,
    newLanguageCode,
    newSettings,
  }: {
    newSettings: Partial<SettingsType>
    newCityCode: string | null
    newLanguageCode: string
  }) => {
    const { settings, cityCode, languageCode, updateSettings, changeCityCode, changeLanguageCode } =
      useContext(AppContext)

    return (
      <View>
        <Text>{JSON.stringify(settings)}</Text>
        {!!cityCode && <Text>{cityCode}</Text>}
        <Text>{languageCode}</Text>

        <Button onPress={() => updateSettings(newSettings)}>updateSettings</Button>
        <Button onPress={() => changeCityCode(newCityCode)}>changeCityCode</Button>
        <Button onPress={() => changeLanguageCode(newLanguageCode)}>changeLanguageCode</Button>
      </View>
    )
  }

  const renderAppContextProvider = ({
    newCityCode = 'muenchen',
    newLanguageCode = 'ar',
    newSettings = defaultSettings,
  }: {
    newSettings?: Partial<SettingsType>
    newCityCode?: string | null
    newLanguageCode?: string
  }) => {
    jest.clearAllMocks()
    return render(
      <AppContextProvider>
        <MockComponent newSettings={newSettings} newCityCode={newCityCode} newLanguageCode={newLanguageCode} />
      </AppContextProvider>,
    )
  }

  beforeEach(() => {
    AsyncStorage.clear()
    jest.clearAllMocks()
    mockedBuildConfig.mockImplementation(() => previousBuildConfig)
  })

  it('should initialize settings from async storage', async () => {
    const settings: SettingsType = {
      storageVersion: 'v1.2',
      contentLanguage: 'de',
      selectedCity: 'augsburg',
      introShown: true,
      errorTracking: false,
      allowPushNotifications: false,
      apiUrlOverride: 'https://webnext.integreat.app',
      jpalTrackingEnabled: true,
      jpalTrackingCode: '123456',
      jpalSignals: [],
      externalSourcePermissions: { 'https://vimeo.com': true },
      selectedTheme: 'light',
    }
    await appSettings.setSettings(settings)
    const { getByText } = renderAppContextProvider({})
    await waitFor(async () => expect(getByText(JSON.stringify(settings))).toBeTruthy())
    expect(setSettings).toHaveBeenCalledTimes(0)
  })

  it('should initialize content language if not yet set', async () => {
    await appSettings.setSettings(defaultSettings)
    const { getByText } = renderAppContextProvider({})
    await waitFor(async () => expect(getByText('en')).toBeTruthy())
    expect(await appSettings.loadSettings()).toMatchObject({ contentLanguage: 'en' })
    expect(setSettings).toHaveBeenCalledTimes(1)
  })

  it('should not update content language if already set', async () => {
    await appSettings.setSettings({ ...defaultSettings, contentLanguage: 'de' })
    const { getByText } = renderAppContextProvider({})
    await waitFor(async () => expect(getByText('de')).toBeTruthy())
    expect(setSettings).toHaveBeenCalledTimes(0)
  })

  it('should store last usage', async () => {
    await appSettings.setSettings({ ...defaultSettings, selectedCity: 'augsburg', contentLanguage: 'de' })
    const { getByText } = renderAppContextProvider({})
    await waitFor(async () => expect(getByText('de')).toBeTruthy())
    expect(setSettings).toHaveBeenCalledTimes(0)
    expect(defaultDataContainer.storeLastUsage).toHaveBeenCalledTimes(1)
    expect(defaultDataContainer.storeLastUsage).toHaveBeenCalledWith('augsburg')
  })

  it('should initialize fixed city', async () => {
    await appSettings.setSettings({ ...defaultSettings, contentLanguage: 'de' })
    mockBuildConfig({ fixedCity: 'hallo' })
    const { getByText } = renderAppContextProvider({})
    await waitFor(async () => expect(getByText('hallo')).toBeTruthy())
    expect(await appSettings.loadSettings()).toMatchObject({ selectedCity: 'hallo' })
    expect(setSettings).toHaveBeenCalledTimes(1)
    expect(subscribeNews).toHaveBeenCalledTimes(1)
    expect(subscribeNews).toHaveBeenCalledWith({ cityCode: 'hallo', languageCode: 'de', allowPushNotifications: true })
  })

  it('should select city', async () => {
    await appSettings.setSettings({ ...defaultSettings, contentLanguage: 'de' })
    const { getByText, queryByText } = renderAppContextProvider({ newCityCode: 'augsburg' })
    await waitFor(async () => expect(getByText('de')).toBeTruthy())
    expect(queryByText('augsburg')).toBeFalsy()

    fireEvent.press(getByText('changeCityCode'))

    await waitFor(async () => expect(getByText('augsburg')).toBeTruthy())
    expect(await appSettings.loadSettings()).toMatchObject({ selectedCity: 'augsburg' })
    expect(setSettings).toHaveBeenCalledTimes(1)
    expect(subscribeNews).toHaveBeenCalledTimes(1)
    expect(subscribeNews).toHaveBeenCalledWith({
      cityCode: 'augsburg',
      languageCode: 'de',
      allowPushNotifications: true,
    })
    expect(unsubscribeNews).not.toHaveBeenCalled()
  })

  it('should change city', async () => {
    await appSettings.setSettings({ ...defaultSettings, contentLanguage: 'de', selectedCity: 'muenchen' })
    const { getByText, queryByText } = renderAppContextProvider({ newCityCode: 'augsburg' })
    await waitFor(async () => expect(getByText('muenchen')).toBeTruthy())
    expect(queryByText('augsburg')).toBeFalsy()

    fireEvent.press(getByText('changeCityCode'))

    await waitFor(async () => expect(getByText('augsburg')).toBeTruthy())
    expect(await appSettings.loadSettings()).toMatchObject({ selectedCity: 'augsburg' })
    expect(setSettings).toHaveBeenCalledTimes(1)
    expect(subscribeNews).toHaveBeenCalledTimes(1)
    expect(subscribeNews).toHaveBeenCalledWith({
      cityCode: 'augsburg',
      languageCode: 'de',
      allowPushNotifications: true,
    })
    expect(unsubscribeNews).toHaveBeenCalledTimes(1)
    expect(unsubscribeNews).toHaveBeenCalledWith('muenchen', 'de')
  })

  it('should deselect city', async () => {
    await appSettings.setSettings({ ...defaultSettings, contentLanguage: 'de', selectedCity: 'muenchen' })
    const { getByText, queryByText } = renderAppContextProvider({ newCityCode: null })
    await waitFor(async () => expect(getByText('muenchen')).toBeTruthy())

    fireEvent.press(getByText('changeCityCode'))

    await waitFor(async () => expect(queryByText('muenchen')).toBeFalsy())
    expect(await appSettings.loadSettings()).toMatchObject({ selectedCity: null })
    expect(setSettings).toHaveBeenCalledTimes(1)
    expect(subscribeNews).not.toHaveBeenCalled()
    expect(unsubscribeNews).toHaveBeenCalledTimes(1)
    expect(unsubscribeNews).toHaveBeenCalledWith('muenchen', 'de')
  })

  it('should change language', async () => {
    await appSettings.setSettings({ ...defaultSettings, contentLanguage: 'de', selectedCity: 'muenchen' })
    const { getByText, queryByText } = renderAppContextProvider({ newCityCode: 'augsburg' })
    await waitFor(async () => expect(getByText('de')).toBeTruthy())
    expect(queryByText('ar')).toBeFalsy()

    fireEvent.press(getByText('changeLanguageCode'))

    await waitFor(async () => expect(getByText('ar')).toBeTruthy())
    expect(await appSettings.loadSettings()).toMatchObject({ contentLanguage: 'ar' })
    expect(setSettings).toHaveBeenCalledTimes(1)
    expect(subscribeNews).toHaveBeenCalledTimes(1)
    expect(subscribeNews).toHaveBeenCalledWith({
      cityCode: 'muenchen',
      languageCode: 'ar',
      allowPushNotifications: true,
    })
    expect(unsubscribeNews).toHaveBeenCalledTimes(1)
    expect(unsubscribeNews).toHaveBeenCalledWith('muenchen', 'de')
  })

  it('should update settings', async () => {
    const oldSettings = { ...defaultSettings, contentLanguage: 'de', selectedCity: 'muenchen' }
    const newSettings = {
      ...oldSettings,
      storageVersion: 'v2.0',
      introShown: true,
      apiUrlOverride: 'https://cms-test.integreat-app.de',
    }
    await appSettings.setSettings(oldSettings)
    const { getByText } = renderAppContextProvider({ newSettings })
    await waitFor(async () => expect(getByText(JSON.stringify(oldSettings))).toBeTruthy())

    fireEvent.press(getByText('updateSettings'))

    await waitFor(async () => expect(getByText(JSON.stringify(newSettings))).toBeTruthy())
    expect(await appSettings.loadSettings()).toEqual(newSettings)
    expect(setSettings).toHaveBeenCalledTimes(1)
  })
})
