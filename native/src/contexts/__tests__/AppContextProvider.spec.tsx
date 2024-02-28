import AsyncStorage from '@react-native-async-storage/async-storage'
import { waitFor } from '@testing-library/react-native'
import React, { useContext } from 'react'
import { Text, View } from 'react-native'

import TextButton from '../../components/base/TextButton'
import render from '../../testing/render'
import appSettings, { defaultSettings, SettingsType } from '../../utils/AppSettings'
import AppContextProvider, { AppContext } from '../AppContextProvider'

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ i18n: { languages: ['en'] } }),
}))

describe('AppContextProvider', () => {
  beforeEach(() => {
    AsyncStorage.clear()
    jest.clearAllMocks()
  })

  const setSettings = jest.spyOn(appSettings, 'setSettings')

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

        <TextButton text='updateSettings' onPress={() => updateSettings(newSettings)} />
        <TextButton text='changeCityCode' onPress={() => changeCityCode(newCityCode)} />
        <TextButton text='changeLanguageCode' onPress={() => changeLanguageCode(newLanguageCode)} />
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
})
