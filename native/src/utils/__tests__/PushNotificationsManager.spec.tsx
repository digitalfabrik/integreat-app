import notifee, { AndroidImportance } from '@notifee/react-native'
import {
  FirebaseMessagingTypes,
  getInitialNotification,
  onMessage,
  onNotificationOpenedApp,
  subscribeToTopic,
  unsubscribeFromTopic,
} from '@react-native-firebase/messaging'
import { waitFor } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'
import { requestNotifications } from 'react-native-permissions'

import buildConfig from '../../constants/buildConfig'
import TestingAppContext from '../../testing/TestingAppContext'
import render from '../../testing/render'
import * as PushNotificationsManager from '../PushNotificationsManager'
import { usePushNotificationListener } from '../PushNotificationsManager'

jest.mock('@react-native-firebase/messaging', () => ({
  getMessaging: () => 'messaging',
  subscribeToTopic: jest.fn(),
  unsubscribeFromTopic: jest.fn(),
  onMessage: jest.fn(),
  getInitialNotification: jest.fn(),
  onNotificationOpenedApp: jest.fn(),
}))

jest.mock('@notifee/react-native', () => ({
  AndroidImportance: { HIGH: 4 },
  getInitialNotification: jest.fn(),
  createChannel: jest.fn(() => 'channel-1234'),
  displayNotification: jest.fn(),
}))

describe('PushNotificationsManager', () => {
  beforeEach(jest.clearAllMocks)

  const mockedBuildConfig = mocked(buildConfig)
  const updateSettings = jest.fn()

  const mockBuildConfig = (pushNotifications: boolean, floss: boolean) => {
    const previous = buildConfig()
    mockedBuildConfig.mockImplementation(() => ({
      ...previous,
      featureFlags: { ...previous.featureFlags, pushNotifications, floss },
    }))
  }

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
      expect(await PushNotificationsManager.requestPushNotificationPermission(updateSettings)).toBeFalsy()
      expect(requestNotifications).not.toHaveBeenCalled()
    })

    it('should return false if it is a floss build', async () => {
      mockBuildConfig(true, true)
      expect(await PushNotificationsManager.requestPushNotificationPermission(updateSettings)).toBeFalsy()
      expect(requestNotifications).not.toHaveBeenCalled()
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
      mocked(unsubscribeFromTopic).mockImplementation(mockUnsubscribeFromTopic)

      await PushNotificationsManager.unsubscribeNews('augsburg', 'de')
      expect(mockUnsubscribeFromTopic).not.toHaveBeenCalled()
    })

    it('should return and do nothing if it is a floss build', async () => {
      mockBuildConfig(true, true)
      const mockUnsubscribeFromTopic = jest.fn()
      mocked(unsubscribeFromTopic).mockImplementation(mockUnsubscribeFromTopic)

      await PushNotificationsManager.unsubscribeNews('augsburg', 'de')
      expect(mockUnsubscribeFromTopic).not.toHaveBeenCalled()
    })

    it('should call unsubscribeFromTopic', async () => {
      mockBuildConfig(true, false)
      const mockUnsubscribeFromTopic = jest.fn()
      mocked(unsubscribeFromTopic).mockImplementation(mockUnsubscribeFromTopic)

      await PushNotificationsManager.unsubscribeNews('augsburg', 'de')
      expect(mockUnsubscribeFromTopic).toHaveBeenCalledWith('messaging', 'augsburg-de-news')
      expect(mockUnsubscribeFromTopic).toHaveBeenCalledTimes(1)
    })
  })

  describe('subscribeNews', () => {
    it('should return and do nothing if disabled in build configs', async () => {
      mockBuildConfig(false, false)
      const mockSubscribeToTopic = jest.fn()
      mocked(subscribeToTopic).mockImplementation(mockSubscribeToTopic)

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
      mocked(subscribeToTopic).mockImplementation(mockSubscribeToTopic)

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
      mocked(subscribeToTopic).mockImplementation(mockSubscribeToTopic)

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
      mocked(subscribeToTopic).mockImplementation(mockSubscribeToTopic)

      await PushNotificationsManager.subscribeNews({
        cityCode: 'augsburg',
        languageCode: 'de',
        allowPushNotifications: true,
      })
      expect(mockSubscribeToTopic).toHaveBeenCalledWith('messaging', 'augsburg-de-news')
      expect(mockSubscribeToTopic).toHaveBeenCalledTimes(1)
    })

    it('should call subscribeToTopic even if push notifications are disabled but skipSettingsCheck is true', async () => {
      mockBuildConfig(true, false)
      const mockSubscribeToTopic = jest.fn()
      mocked(subscribeToTopic).mockImplementation(mockSubscribeToTopic)

      await PushNotificationsManager.subscribeNews({
        cityCode: 'augsburg',
        languageCode: 'de',
        allowPushNotifications: false,
        skipSettingsCheck: true,
      })
      expect(mockSubscribeToTopic).toHaveBeenCalledWith('messaging', 'augsburg-de-news')
      expect(mockSubscribeToTopic).toHaveBeenCalledTimes(1)
    })
  })

  describe('usePushNotificationListener', () => {
    const navigate = jest.fn()
    const MockComponent = () => {
      usePushNotificationListener(navigate)
      return null
    }
    const renderMockComponent = () =>
      render(
        <TestingAppContext>
          <MockComponent />
        </TestingAppContext>,
      )

    const message: FirebaseMessagingTypes.RemoteMessage = {
      notification: { title: 'Test PN', body: 'Test Body' },
      data: {
        city_code: 'augsburg',
        language_code: 'de',
        news_id: '123',
        group: 'news',
        url: '',
      },
      fcmOptions: {},
    }

    it('should display a notification if the app is in the foreground', async () => {
      mocked(onMessage).mockImplementation((_, listener) => listener(message))
      renderMockComponent()
      await waitFor(() =>
        expect(notifee.displayNotification).toHaveBeenCalledWith({
          title: 'Test PN',
          body: 'Test Body',
          data: {
            city_code: 'augsburg',
            language_code: 'de',
            news_id: '123',
            group: 'news',
            url: '',
          },
          android: {
            channelId: 'channel-1234',
            color: '#fbda16',
            importance: AndroidImportance.HIGH,
            smallIcon: 'notification_icon_integreat',
          },
        }),
      )
    })

    it('should open news if notification pressed in quit state', async () => {
      mocked(getInitialNotification).mockImplementation(async () => message)
      renderMockComponent()
      await waitFor(() => expect(navigate).toHaveBeenCalledTimes(1), { timeout: 1100 })
      expect(navigate).toHaveBeenCalledWith('news', {
        cityCode: 'augsburg',
        languageCode: 'de',
        newsId: 123,
        newsType: 'local',
        route: 'news',
      })
    })

    it('should open news if notification pressed in background state', async () => {
      mocked(onNotificationOpenedApp).mockImplementation((_, listener) => listener(message))
      renderMockComponent()
      await waitFor(() => expect(navigate).toHaveBeenCalledTimes(2), { timeout: 1100 })
      expect(navigate).toHaveBeenCalledWith('news', {
        cityCode: 'augsburg',
        languageCode: 'de',
        newsId: 123,
        newsType: 'local',
        route: 'news',
      })
    })
  })
})
