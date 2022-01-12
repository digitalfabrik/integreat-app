import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import { mocked } from 'ts-jest/utils'

import buildConfig from '../../constants/buildConfig'
import * as PushNotificationsManager from '../PushNotificationsManager'

jest.mock('@react-native-firebase/messaging', () => jest.fn(() => ({})))

describe('PushNotificationsManager', () => {
  const mockedFirebaseMessaging = mocked<() => FirebaseMessagingTypes.Module>(messaging)
  const mockedBuildConfig = mocked(buildConfig)
  const previousFirebaseMessaging = mockedFirebaseMessaging()

  const mockBuildConfig = (pushNotifications: boolean, floss: boolean) => {
    const previous = buildConfig()
    mockedBuildConfig.mockImplementation(() => ({
      ...previous,
      featureFlags: { ...previous.featureFlags, pushNotifications, floss }
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
      mockedFirebaseMessaging.mockImplementation(() => {
        const previous = previousFirebaseMessaging
        previous.requestPermission = mockRequestPermission
        return previous
      })

      expect(await PushNotificationsManager.requestPushNotificationPermission()).toBeFalsy()
      expect(mockRequestPermission).not.toHaveBeenCalled()
    })

    it('should return false if it is a floss build', async () => {
      mockBuildConfig(true, true)
      const mockRequestPermission = jest.fn(async () => 0)
      mockedFirebaseMessaging.mockImplementation(() => {
        const previous = previousFirebaseMessaging
        previous.requestPermission = mockRequestPermission
        return previous
      })

      expect(await PushNotificationsManager.requestPushNotificationPermission()).toBeFalsy()
      expect(mockRequestPermission).not.toHaveBeenCalled()
    })

    it('should request permissions and return false if not granted', async () => {
      mockBuildConfig(true, false)
      const mockRequestPermission = jest.fn(async () => 0)
      mockedFirebaseMessaging.mockImplementation(() => {
        const previous = previousFirebaseMessaging
        previous.requestPermission = mockRequestPermission
        return previous
      })

      expect(await PushNotificationsManager.requestPushNotificationPermission()).toBeFalsy()
      expect(mockRequestPermission).toHaveBeenCalledTimes(1)
    })

    it('should request permissions and return true if granted', async () => {
      mockBuildConfig(true, false)
      const mockRequestPermission = jest.fn(async () => 1)
      mockedFirebaseMessaging.mockImplementation(() => {
        const previous = previousFirebaseMessaging
        previous.requestPermission = mockRequestPermission
        return previous
      })

      expect(await PushNotificationsManager.requestPushNotificationPermission()).toBeTruthy()
      expect(mockRequestPermission).toHaveBeenCalledTimes(1)
    })
  })

  describe('unsubscribeNews', () => {
    it('should return and do nothing if disabled in build configs', async () => {
      mockBuildConfig(false, false)
      const mockUnsubscribeFromTopic = jest.fn()
      mockedFirebaseMessaging.mockImplementation(() => {
        const previous = previousFirebaseMessaging
        previous.unsubscribeFromTopic = mockUnsubscribeFromTopic
        return previous
      })

      await PushNotificationsManager.unsubscribeNews('augsburg', 'de')
      expect(mockUnsubscribeFromTopic).not.toHaveBeenCalled()
    })

    it('should return and do nothing if it is a floss build', async () => {
      mockBuildConfig(true, true)
      const mockUnsubscribeFromTopic = jest.fn()
      mockedFirebaseMessaging.mockImplementation(() => {
        const previous = previousFirebaseMessaging
        previous.unsubscribeFromTopic = mockUnsubscribeFromTopic
        return previous
      })

      await PushNotificationsManager.unsubscribeNews('augsburg', 'de')
      expect(mockUnsubscribeFromTopic).not.toHaveBeenCalled()
    })

    it('should call unsubscribeFromTopic', async () => {
      mockBuildConfig(true, false)
      const mockUnsubscribeFromTopic = jest.fn()
      mockedFirebaseMessaging.mockImplementation(() => {
        const previous = previousFirebaseMessaging
        previous.unsubscribeFromTopic = mockUnsubscribeFromTopic
        return previous
      })

      await PushNotificationsManager.unsubscribeNews('augsburg', 'de')
      expect(mockUnsubscribeFromTopic).toHaveBeenCalledWith('augsburg-de-news')
      expect(mockUnsubscribeFromTopic).toHaveBeenCalledTimes(1)
    })
  })

  describe('subscribeNews', () => {
    it('should return and do nothing if disabled in build configs', async () => {
      mockBuildConfig(false, false)
      const mockSubscribeToTopic = jest.fn()
      mockedFirebaseMessaging.mockImplementation(() => {
        const previous = previousFirebaseMessaging
        previous.subscribeToTopic = mockSubscribeToTopic
        return previous
      })

      await PushNotificationsManager.subscribeNews('augsburg', 'de')
      expect(mockSubscribeToTopic).not.toHaveBeenCalled()
    })

    it('should return and do nothing if it is a floss build', async () => {
      mockBuildConfig(true, true)
      const mockSubscribeToTopic = jest.fn()
      mockedFirebaseMessaging.mockImplementation(() => {
        const previous = previousFirebaseMessaging
        previous.subscribeToTopic = mockSubscribeToTopic
        return previous
      })

      await PushNotificationsManager.subscribeNews('augsburg', 'de')
      expect(mockSubscribeToTopic).not.toHaveBeenCalled()
    })

    it('should call subscribeToTopic', async () => {
      mockBuildConfig(true, false)
      const mockSubscribeToTopic = jest.fn()
      mockedFirebaseMessaging.mockImplementation(() => {
        const previous = previousFirebaseMessaging
        previous.subscribeToTopic = mockSubscribeToTopic
        return previous
      })

      await PushNotificationsManager.subscribeNews('augsburg', 'de')
      expect(mockSubscribeToTopic).toHaveBeenCalledWith('augsburg-de-news')
      expect(mockSubscribeToTopic).toHaveBeenCalledTimes(1)
    })
  })
})
