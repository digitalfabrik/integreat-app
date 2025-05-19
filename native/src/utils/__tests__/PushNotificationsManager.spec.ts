import { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import { mocked } from 'jest-mock'
import { requestNotifications } from 'react-native-permissions'

import buildConfig from '../../constants/buildConfig'
import * as PushNotificationsManager from '../PushNotificationsManager'

const messaging = {
  subscribeToTopic: jest.fn(),
  unsubscribeFromTopic: jest.fn(),
  getInitialNotification: jest.fn(),
  requestPermission: jet.fn(),
}

jest.mock('@react-native-firebase/messaging', () => ({
  getMessaging: () => mesaging,
}))

describe('PushNotificationsManager', () => {
  beforeEach(jest.clearAllMocks)

  const mockedBuildConfig = mocked(buildConfig)
  const navigateToDeepLink = jest.fn()
  const updateSettings = jest.fn()

  const mockBuildConfig = (pushNotifications: boolean, floss: boolean) => {
    const previous = buildConfig()
    mockedBuildConfig.mockImplementation(() => ({
      ...previous,
      featureFlags: { ...previous.featureFlags, pushNotifications, floss },
    }))
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })
  describe('pushNotificationsEnabled', () => {
    it('should return false if disabled in build configs', async () => {
      mockBuildConfig(false, false)
      expect(PushNotificationsManager.pushNotificationsEnabled()).toBeFalsy()
    })

    it('should return false if it is a floss build', async () => {
      mockBuildConfig(true, true)
      expect(PushNotificationsManager.pushNotificationsEnabled()).toBeFalsy()
    })

    it('should return true if it is enabled in build config and not a floss build', async () => {
      mockBuildConfig(true, false)
      expect(PushNotificationsManager.pushNotificationsEnabled()).toBeTruthy()
    })
  })

  describe('requestPushNotificationPermission', () => {
    it('should return false if disabled in build configs', async () => {
      mockBuildConfig(false, false)
      const mockRequestPermission = jest.fn(async () => 0)
      messaging.requestPermission = mockRequestPermission

      expect(await PushNotificationsManager.requestPushNotificationPermission(updateSettings)).toBeFalsy()
      expect(mockRequestPermission).not.toHaveBeenCalled()
    })

    it('should return false if it is a floss build', async () => {
      mockBuildConfig(true, true)
      const mockRequestPermission = jest.fn(async () => 0)
      messaging.requestPermission.mockImplementation(mockRequestPermission)

      expect(await PushNotificationsManager.requestPushNotificationPermission(updateSettings)).toBeFalsy()
      expect(mockRequestPermission).not.toHaveBeenCalled()
    })

    it('should request permissions and return false and disable push notifications in settings if not granted', async () => {
      mockBuildConfig(true, false)
      mocked(requestNotifications).mockImplementationOnce(async () => ({ status: 'blocked', settings: {} }))

      expect(await PushNotificationsManager.requestPushNotificationPermission(updateSettings)).toBeFalsy()
      expect(updateSettings).toHaveBeenCalledTimes(1)
      expect(updateSettings).toHaveBeenCalledWith({ allowPushNotifications: false })
    })

    it('should request permissions and return true if granted', async () => {
      mockBuildConfig(true, false)
      mocked(requestNotifications).mockImplementationOnce(async () => ({ status: 'granted', settings: {} }))

      expect(await PushNotificationsManager.requestPushNotificationPermission(updateSettings)).toBeTruthy()
      expect(updateSettings).not.toHaveBeenCalled()
    })
  })

  describe('unsubscribeNews', () => {
    it('should return and do nothing if disabled in build configs', async () => {
      mockBuildConfig(false, false)
      const mockUnsubscribeFromTopic = jest.fn()
      messaging.unsubscribeFromTopic.mockImplementation(mockUnsubscribeFromTopic)

      await PushNotificationsManager.unsubscribeNews('augsburg', 'de')
      expect(mockUnsubscribeFromTopic).not.toHaveBeenCalled()
    })

    it('should return and do nothing if it is a floss build', async () => {
      mockBuildConfig(true, true)
      const mockUnsubscribeFromTopic = jest.fn()
      messaging.unsubscribeFromTopic.mockImplementation(mockUnsubscribeFromTopic)

      await PushNotificationsManager.unsubscribeNews('augsburg', 'de')
      expect(mockUnsubscribeFromTopic).not.toHaveBeenCalled()
    })

    it('should call unsubscribeFromTopic', async () => {
      mockBuildConfig(true, false)
      const mockUnsubscribeFromTopic = jest.fn()
      messaging.unsubscribeFromTopic.mockImplementation(mockUnsubscribeFromTopic)

      await PushNotificationsManager.unsubscribeNews('augsburg', 'de')
      expect(mockUnsubscribeFromTopic).toHaveBeenCalledWith('augsburg-de-news')
      expect(mockUnsubscribeFromTopic).toHaveBeenCalledTimes(1)
    })
  })

  describe('subscribeNews', () => {
    it('should return and do nothing if disabled in build configs', async () => {
      mockBuildConfig(false, false)
      const mockSubscribeToTopic = jest.fn()
      messaging.subscribeToTopic.mockImplementation(mockSubscribeToTopic)

      await PushNotificationsManager.subscribeNews({
        cityCode: 'augsburg',
        languageCode: 'de',
        allowPushNotifications: true,
      })
      expect(mockSubscribeToTopic).not.toHaveBeenCalled()
    })

    it('should return and do nothing if it is a floss build', async () => {
      mockBuildConfig(true, true)
      const mockSubscribeToTopic = jest.fn()
      messaging.subscribeToTopic.mockImplementation(mockSubscribeToTopic)

      await PushNotificationsManager.subscribeNews({
        cityCode: 'augsburg',
        languageCode: 'de',
        allowPushNotifications: true,
      })
      expect(mockSubscribeToTopic).not.toHaveBeenCalled()
    })

    it('should return and do nothing if it is disabled in settings', async () => {
      mockBuildConfig(true, false)
      const mockSubscribeToTopic = jest.fn()
      messaging.subscribeToTopic.mockImplementation(mockSubscribeToTopic)

      await PushNotificationsManager.subscribeNews({
        cityCode: 'augsburg',
        languageCode: 'de',
        allowPushNotifications: false,
      })
      expect(mockSubscribeToTopic).not.toHaveBeenCalled()
    })

    it('should call subscribeToTopic', async () => {
      mockBuildConfig(true, false)
      const mockSubscribeToTopic = jest.fn()
      messaging.subscribeToTopic.mockImplementation(mockSubscribeToTopic)

      await PushNotificationsManager.subscribeNews({
        cityCode: 'augsburg',
        languageCode: 'de',
        allowPushNotifications: true,
      })
      expect(mockSubscribeToTopic).toHaveBeenCalledWith('augsburg-de-news')
      expect(mockSubscribeToTopic).toHaveBeenCalledTimes(1)
    })

    it('should call subscribeToTopic even if push notifications are disabled but skipSettingsCheck is true', async () => {
      mockBuildConfig(true, false)
      const mockSubscribeToTopic = jest.fn()
      messaging.subscribeToTopic.mockImplementation(mockSubscribeToTopic)

      await PushNotificationsManager.subscribeNews({
        cityCode: 'augsburg',
        languageCode: 'de',
        allowPushNotifications: false,
        skipSettingsCheck: true,
      })
      expect(mockSubscribeToTopic).toHaveBeenCalledWith('augsburg-de-news')
      expect(mockSubscribeToTopic).toHaveBeenCalledTimes(1)
    })
  })

  describe('quitAppStatePushNotificationsListener', () => {
    const message: FirebaseMessagingTypes.RemoteMessage = {
      notification: { title: 'Test PN' },
      data: {
        city_code: 'augsburg',
        language_code: 'de',
        news_id: '123',
        group: 'news',
      },
      fcmOptions: {},
    }
    it('should go to news if there is an initial message', async () => {
      const url = 'https://integreat.app/augsburg/de/news/local/123'
      messaging.getInitialNotification.mockImplementation(async () => message)

      await PushNotificationsManager.quitAppStatePushNotificationListener(navigateToDeepLink)
      expect(navigateToDeepLink).toHaveBeenCalledTimes(1)
      expect(navigateToDeepLink).toHaveBeenCalledWith(url)
    })

    it('should not go to news if there is no initial message', async () => {
      messaging.getInitialNotification.mockImplementation(async () => null)

      await PushNotificationsManager.quitAppStatePushNotificationListener(navigateToDeepLink)
      expect(navigateToDeepLink).not.toHaveBeenCalled()
    })
  })
})
