import { TFunction } from 'i18next'
import { mocked } from 'jest-mock'

import { SettingsRouteType } from 'shared'

import { testingAppContext } from '../../testing/TestingAppContext'
import createNavigationScreenPropMock from '../../testing/createNavigationPropMock'
import { SettingsType } from '../AppSettings'
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
jest.mock('@react-native-community/geolocation')

const mockRequestPushNotificationPermission = mocked(requestPushNotificationPermission)
const mockUnsubscribeNews = mocked(unsubscribeNews)
const mockSubscribeNews = mocked(subscribeNews)
const mockedPushNotificationsEnabled = mocked(pushNotificationsEnabled)

describe('createSettingsSections', () => {
  beforeEach(jest.clearAllMocks)

  const t = ((key: string) => key) as TFunction

  const updateSettings = jest.fn()
  const cityCode = 'augsburg'
  const appContext = { ...testingAppContext({}), cityCode, updateSettings }
  const navigation = createNavigationScreenPropMock<SettingsRouteType>()
  const showSnackbar = jest.fn()

  const createSettings = (params: Partial<SettingsType> = {}) =>
    createSettingsSections({
      appContext: { ...appContext, settings: { ...appContext.settings, ...params } },
      navigation,
      showSnackbar,
      t,
    })

  describe('allowPushNotifications', () => {
    it('should not include push notification setting if disabled', () => {
      mockedPushNotificationsEnabled.mockImplementation(() => false)
      const sections = createSettings()
      expect(sections.find(it => it?.title === 'externalResourcesTitle')).toBeTruthy()
      expect(sections.find(it => it?.title === 'pushNewsTitle')).toBeFalsy()
    })

    it('should set correct setting on press', async () => {
      mockedPushNotificationsEnabled.mockImplementation(() => true)
      const sections = createSettings()
      const pushNotificationSection = sections.find(it => it?.title === 'pushNewsTitle')!
      await pushNotificationSection!.onPress()
      expect(updateSettings).toHaveBeenCalledTimes(1)
      expect(updateSettings).toHaveBeenCalledWith({ allowPushNotifications: false })

      expect(
        pushNotificationSection.getSettingValue!({ ...appContext.settings, allowPushNotifications: false }),
      ).toBeFalsy()
      expect(
        pushNotificationSection!.getSettingValue!({ ...appContext.settings, allowPushNotifications: true }),
      ).toBeTruthy()
    })

    it('should unsubscribe from push notification topic', async () => {
      mockedPushNotificationsEnabled.mockImplementation(() => true)
      const sections = createSettings()
      const pushNotificationSection = sections.find(it => it?.title === 'pushNewsTitle')!

      expect(mockUnsubscribeNews).not.toHaveBeenCalled()

      await pushNotificationSection.onPress()

      expect(mockUnsubscribeNews).toHaveBeenCalledTimes(1)
      expect(mockUnsubscribeNews).toHaveBeenCalledWith(cityCode, appContext.languageCode)
      expect(mockSubscribeNews).not.toHaveBeenCalled()
      expect(mockRequestPushNotificationPermission).not.toHaveBeenCalled()

      expect(updateSettings).toHaveBeenCalledTimes(1)
      expect(updateSettings).toHaveBeenCalledWith({ allowPushNotifications: false })
    })

    it('should subscribe to push notification topic if permission is granted', async () => {
      mockedPushNotificationsEnabled.mockImplementation(() => true)
      const sections = createSettings({ allowPushNotifications: false })
      const pushNotificationSection = sections.find(it => it?.title === 'pushNewsTitle')!

      expect(mockRequestPushNotificationPermission).not.toHaveBeenCalled()
      expect(mockSubscribeNews).not.toHaveBeenCalled()
      mockRequestPushNotificationPermission.mockImplementationOnce(async () => true)

      await pushNotificationSection.onPress()

      expect(mockRequestPushNotificationPermission).toHaveBeenCalledTimes(1)
      expect(mockSubscribeNews).toHaveBeenCalledTimes(1)
      expect(mockSubscribeNews).toHaveBeenCalledWith({
        cityCode,
        languageCode: appContext.languageCode,
        allowPushNotifications: true,
        skipSettingsCheck: true,
      })
      expect(mockUnsubscribeNews).not.toHaveBeenCalled()

      expect(updateSettings).toHaveBeenCalledTimes(1)
      expect(updateSettings).toHaveBeenCalledWith({ allowPushNotifications: true })
    })

    it('should open settings and return false if permissions not granted', async () => {
      mockedPushNotificationsEnabled.mockImplementation(() => true)
      const sections = createSettings({ allowPushNotifications: false })
      const pushNotificationSection = sections.find(it => it?.title === 'pushNewsTitle')!

      expect(mockRequestPushNotificationPermission).not.toHaveBeenCalled()
      expect(mockSubscribeNews).not.toHaveBeenCalled()
      mockRequestPushNotificationPermission.mockImplementationOnce(async () => false)

      await pushNotificationSection.onPress()

      expect(mockRequestPushNotificationPermission).toHaveBeenCalledTimes(1)
      expect(mockSubscribeNews).not.toHaveBeenCalled()
      expect(mockUnsubscribeNews).not.toHaveBeenCalled()

      expect(updateSettings).toHaveBeenCalledTimes(2)
      expect(updateSettings).toHaveBeenLastCalledWith({ allowPushNotifications: false })
      expect(showSnackbar).toHaveBeenCalledTimes(1)
    })
  })
})
