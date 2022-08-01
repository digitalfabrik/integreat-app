import { mocked } from 'jest-mock'
import { openSettings } from 'react-native-permissions'

import { SettingsRouteType } from 'api-client'

import createNavigationScreenPropMock from '../../testing/createNavigationPropMock'
import { defaultSettings, SettingsType } from '../AppSettings'
import {
  pushNotificationsEnabled,
  requestPushNotificationPermission,
  subscribeNews,
  unsubscribeNews,
} from '../PushNotificationsManager'
import createSettingsSections from '../createSettingsSections'

jest.mock('../../constants/NativeConstants', () => ({
  appVersion: '1.0.0',
}))

jest.mock('../../utils/PushNotificationsManager', () => ({
  pushNotificationsEnabled: jest.fn(),
  requestPushNotificationPermission: jest.fn(),
  subscribeNews: jest.fn(),
  unsubscribeNews: jest.fn(),
}))
jest.mock('react-native-permissions', () => require('react-native-permissions/mock'))
jest.mock('@react-native-community/geolocation')

const mockRequestPushNotificationPermission = mocked(requestPushNotificationPermission)
const mockUnsubscribeNews = mocked(unsubscribeNews)
const mockSubscribeNews = mocked(subscribeNews)
const mockedPushNotificationsEnabled = mocked(pushNotificationsEnabled)

type changeSettingFnType = (settings: SettingsType) => Partial<SettingsType>
type changeActionFnType = void | ((newSettings: SettingsType) => Promise<boolean>)

describe('createSettingsSections', () => {
  let changeSetting: changeSettingFnType
  let changeAction: void | ((newSettings: SettingsType) => Promise<boolean>)

  beforeEach(() => {
    jest.clearAllMocks()
    changeSetting = settings => settings
    changeAction = async () => true
  })

  const setSetting = async (newChangeSetting: changeSettingFnType, newChangeAction: changeActionFnType) => {
    changeSetting = newChangeSetting
    changeAction = newChangeAction
  }

  const t = (key: string) => key

  const languageCode = 'de'
  const cityCode = 'augsburg'
  const navigation = createNavigationScreenPropMock<SettingsRouteType>()
  const showSnackbar = jest.fn()

  const createSettings = () =>
    createSettingsSections({
      t,
      languageCode,
      cityCode,
      navigation,
      settings: defaultSettings,
      setSetting,
      showSnackbar,
    })[0]!.data

  describe('allowPushNotifications', () => {
    it('should not include push notification setting if disabled', () => {
      mockedPushNotificationsEnabled.mockImplementation(() => false)
      const sections = createSettings()
      expect(sections.find(it => it.title === 'privacyPolicy')).toBeTruthy()
      expect(sections.find(it => it.title === 'pushNewsTitle')).toBeFalsy()
    })

    it('should set correct setting on press', () => {
      mockedPushNotificationsEnabled.mockImplementation(() => true)
      const sections = createSettings()
      const pushNotificationSection = sections.find(it => it.title === 'pushNewsTitle')
      // Initialize changeSetting and changeAction
      pushNotificationSection!.onPress()

      const settings = defaultSettings
      settings.allowPushNotifications = false
      const changedSettings = changeSetting(settings)
      expect(pushNotificationSection!.getSettingValue!(settings)).toBeFalsy()
      expect(changedSettings.allowPushNotifications).toBeTruthy()
      settings.allowPushNotifications = true
      const changedSettings2 = changeSetting(settings)
      expect(pushNotificationSection!.getSettingValue!(settings)).toBeTruthy()
      expect(changedSettings2.allowPushNotifications).toBeFalsy()
    })

    it('should unsubscribe from push notification topic', async () => {
      mockedPushNotificationsEnabled.mockImplementation(() => true)
      const sections = createSettings()
      const pushNotificationSection = sections.find(it => it.title === 'pushNewsTitle')
      // Initialize changeSetting and changeAction
      pushNotificationSection?.onPress()
      const newSettings = defaultSettings
      newSettings.allowPushNotifications = false

      const assertedChangeAction = changeAction as (newSettings: SettingsType) => Promise<boolean>

      expect(mockUnsubscribeNews).not.toHaveBeenCalled()

      const successful = await assertedChangeAction(newSettings)
      expect(successful).toBe(true)
      expect(mockUnsubscribeNews).toHaveBeenCalledTimes(1)
      expect(mockUnsubscribeNews).toHaveBeenCalledWith(cityCode, languageCode)
      expect(mockSubscribeNews).not.toHaveBeenCalled()
      expect(mockRequestPushNotificationPermission).not.toHaveBeenCalled()
    })

    it('should subscribe to push notification topic if permission is granted', async () => {
      mockedPushNotificationsEnabled.mockImplementation(() => true)
      const sections = createSettings()
      const pushNotificationSection = sections.find(it => it.title === 'pushNewsTitle')
      // Initialize changeSetting and changeAction
      pushNotificationSection?.onPress()
      const newSettings = defaultSettings
      newSettings.allowPushNotifications = true

      const assertedChangeAction = changeAction as (newSettings: SettingsType) => Promise<boolean>

      expect(mockRequestPushNotificationPermission).not.toHaveBeenCalled()
      expect(mockSubscribeNews).not.toHaveBeenCalled()
      mockRequestPushNotificationPermission.mockImplementationOnce(async () => true)

      const successful = await assertedChangeAction(newSettings)
      expect(successful).toBe(true)
      expect(mockRequestPushNotificationPermission).toHaveBeenCalledTimes(1)
      expect(mockSubscribeNews).toHaveBeenCalledTimes(1)
      expect(mockSubscribeNews).toHaveBeenCalledWith(cityCode, languageCode)
      expect(mockUnsubscribeNews).not.toHaveBeenCalled()
    })

    it('should open settings and return false if permissions not granted', async () => {
      mockedPushNotificationsEnabled.mockImplementation(() => true)
      const sections = createSettings()
      const pushNotificationSection = sections.find(it => it.title === 'pushNewsTitle')
      // Initialize changeSetting and changeAction
      pushNotificationSection?.onPress()
      const newSettings = defaultSettings
      newSettings.allowPushNotifications = true

      const assertedChangeAction = changeAction as (newSettings: SettingsType) => Promise<boolean>

      expect(mockRequestPushNotificationPermission).not.toHaveBeenCalled()
      expect(mockSubscribeNews).not.toHaveBeenCalled()
      mockRequestPushNotificationPermission.mockImplementationOnce(async () => false)

      const successful = await assertedChangeAction(newSettings)
      expect(successful).toBe(false)
      expect(mockRequestPushNotificationPermission).toHaveBeenCalledTimes(1)
      expect(openSettings).toHaveBeenCalledTimes(1)
      expect(mockSubscribeNews).not.toHaveBeenCalled()
      expect(mockUnsubscribeNews).not.toHaveBeenCalled()
    })
  })
})
