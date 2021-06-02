import createSettingsSections from '../createSettingsSections'
import createNavigationScreenPropMock from '../../../testing/createNavigationPropMock'
import { defaultSettings, SettingsType } from '../../../services/AppSettings'
import buildConfig from '../../../constants/buildConfig'
import { openSettings } from 'react-native-permissions'
import { SettingsRouteType } from 'api-client'
import {
  requestPushNotificationPermission,
  subscribeNews,
  unsubscribeNews
} from '../../../services/PushNotificationsManager'

jest.mock('../../../constants/NativeConstants', () => ({
  appVersion: '1.0.0'
}))

jest.mock('../../../services/PushNotificationsManager', () => ({
  requestPushNotificationPermission: jest.fn(),
  subscribeNews: jest.fn(),
  unsubscribeNews: jest.fn()
}))
jest.mock('react-native-permissions', () => require('react-native-permissions/mock'))
jest.mock('@react-native-community/geolocation')
jest.mock('../../../services/initSentry')

const mockRequestPushNotificationPermission = (requestPushNotificationPermission as unknown) as jest.Mock
const mockUnsubscribeNews = (unsubscribeNews as unknown) as jest.Mock
const mockSubscribeNews = (subscribeNews as unknown) as jest.Mock
const mockedBuildConfig = (buildConfig as unknown) as jest.Mock

describe('createSettingsSections', () => {
  let changeSetting: (settings: SettingsType) => Partial<SettingsType>
  let changeAction: void | ((newSettings: SettingsType) => Promise<void>)

  beforeEach(() => {
    jest.clearAllMocks()
    changeSetting = settings => settings
    changeAction = async () => {}
  })

  const setSetting = async (newChangeSetting, newChangeAction) => {
    changeSetting = newChangeSetting
    changeAction = newChangeAction
  }

  const t = key => key

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
      setSetting,
      settings: defaultSettings,
      showSnackbar
    })[0].data

  const mockBuildConfig = (pushNotifications: boolean) => {
    const previous = buildConfig()
    mockedBuildConfig.mockImplementation(() => ({
      ...previous,
      featureFlags: { ...previous.featureFlags, pushNotifications }
    }))
  }

  describe('allowPushNotifications', () => {
    it('should not include push notification setting if disabled in build config', () => {
      mockBuildConfig(false)
      const sections = createSettings()
      expect(sections.find(it => it.title === 'privacyPolicy')).toBeTruthy()
      expect(sections.find(it => it.title === 'pushNewsTitle')).toBeFalsy()
    })

    it('should set correct setting on press', () => {
      mockBuildConfig(true)
      const sections = createSettings()
      const pushNotificationSection = sections.find(it => it.title === 'pushNewsTitle')
      // Initialize changeSetting and changeAction
      if (pushNotificationSection) {
        pushNotificationSection.onPress()
      }
      const settings = defaultSettings
      settings.allowPushNotifications = false
      const changedSettings = changeSetting(settings)
      // @ts-ignore
      expect(pushNotificationSection.getSettingValue(settings)).toBeFalsy()
      expect(changedSettings.allowPushNotifications).toBeTruthy()
      settings.allowPushNotifications = true
      const changedSettings2 = changeSetting(settings)
      // @ts-ignore
      expect(pushNotificationSection.getSettingValue(settings)).toBeTruthy()
      expect(changedSettings2.allowPushNotifications).toBeFalsy()
    })

    it('should unsubscribe from push notification topic', async () => {
      mockBuildConfig(true)
      const sections = createSettings()
      const pushNotificationSection = sections.find(it => it.title === 'pushNewsTitle')
      // Initialize changeSetting and changeAction
      pushNotificationSection?.onPress()
      const newSettings = defaultSettings
      newSettings.allowPushNotifications = false

      if (!changeAction) {
        expect(false).toBeTruthy()
      } else {
        expect(mockUnsubscribeNews).not.toHaveBeenCalled()
        await changeAction(newSettings)
        expect(mockUnsubscribeNews).toHaveBeenCalledTimes(1)
        expect(mockUnsubscribeNews).toHaveBeenCalledWith(cityCode, languageCode)
        expect(mockSubscribeNews).not.toHaveBeenCalled()
        expect(mockRequestPushNotificationPermission).not.toHaveBeenCalled()
      }
    })

    it('should subscribe to push notification topic if permission is granted', async () => {
      mockBuildConfig(true)
      const sections = createSettings()
      const pushNotificationSection = sections.find(it => it.title === 'pushNewsTitle')
      // Initialize changeSetting and changeAction
      pushNotificationSection?.onPress()
      const newSettings = defaultSettings
      newSettings.allowPushNotifications = true

      if (!changeAction) {
        expect(false).toBeTruthy()
      } else {
        expect(mockRequestPushNotificationPermission).not.toHaveBeenCalled()
        expect(mockSubscribeNews).not.toHaveBeenCalled()
        mockRequestPushNotificationPermission.mockImplementationOnce(async () => true)
        await changeAction(newSettings)
        expect(mockRequestPushNotificationPermission).toHaveBeenCalledTimes(1)
        expect(mockSubscribeNews).toHaveBeenCalledTimes(1)
        expect(mockSubscribeNews).toHaveBeenCalledWith(cityCode, languageCode)
        expect(mockUnsubscribeNews).not.toHaveBeenCalled()
      }
    })

    it('should open settings and throw if permissions not granted', async () => {
      mockBuildConfig(true)
      const sections = createSettings()
      const pushNotificationSection = sections.find(it => it.title === 'pushNewsTitle')
      // Initialize changeSetting and changeAction
      pushNotificationSection?.onPress()
      const newSettings = defaultSettings
      newSettings.allowPushNotifications = true

      if (!changeAction) {
        expect(false).toBeTruthy()
      } else {
        expect(mockRequestPushNotificationPermission).not.toHaveBeenCalled()
        expect(mockSubscribeNews).not.toHaveBeenCalled()
        mockRequestPushNotificationPermission.mockImplementationOnce(async () => false)
        await expect(changeAction(newSettings)).rejects.toThrowError()
        expect(mockRequestPushNotificationPermission).toHaveBeenCalledTimes(1)
        expect(openSettings).toHaveBeenCalledTimes(1)
        expect(mockSubscribeNews).not.toHaveBeenCalled()
        expect(mockUnsubscribeNews).not.toHaveBeenCalled()
      }
    })
  })
})
