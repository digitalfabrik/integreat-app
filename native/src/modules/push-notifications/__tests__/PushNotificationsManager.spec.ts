import * as PushNotificationsManager from '../PushNotificationsManager'
import buildConfig from '../../app/constants/buildConfig'
import messaging from '@react-native-firebase/messaging'

jest.mock('@react-native-firebase/messaging', () => jest.fn())

jest.mock('@react-native-firebase/app', () => ({
  utils: jest.fn()
}))

describe('PushNotificationsManager', () => {
  const mockBuildConfig = (buildConfig as unknown) as jest.Mock
  const mockFirebaseMessaging = (messaging as unknown) as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('requestPushNotificationPermission', () => {
    it('should return false if disabled in build configs', async () => {
      mockBuildConfig.mockImplementationOnce(() => ({
        featureFlags: { pushNotifications: false }
      }))
      const mockRequestPermission = jest.fn(() => 0)
      mockFirebaseMessaging.mockImplementation(() => ({ requestPermission: mockRequestPermission }))

      expect(await PushNotificationsManager.requestPushNotificationPermission()).toBeFalsy()
      expect(mockRequestPermission).not.toHaveBeenCalled()
    })

    it('should request permissions and return false if not granted', async () => {
      mockBuildConfig.mockImplementationOnce(() => ({
        featureFlags: { pushNotifications: true }
      }))
      const mockRequestPermission = jest.fn(() => 0)
      mockFirebaseMessaging.mockImplementation(() => ({ requestPermission: mockRequestPermission }))

      expect(await PushNotificationsManager.requestPushNotificationPermission()).toBeFalsy()
      expect(mockRequestPermission).toHaveBeenCalledTimes(1)
    })

    it('should request permissions and return true if granted', async () => {
      mockBuildConfig.mockImplementationOnce(() => ({
        featureFlags: { pushNotifications: true }
      }))
      const mockRequestPermission = jest.fn(() => 1)
      mockFirebaseMessaging.mockImplementation(() => ({ requestPermission: mockRequestPermission }))

      expect(await PushNotificationsManager.requestPushNotificationPermission()).toBeTruthy()
      expect(mockRequestPermission).toHaveBeenCalledTimes(1)
    })
  })

  describe('unsubscribeNews', () => {
    it('should return and do nothing if disabled in build configs', async () => {
      mockBuildConfig.mockImplementationOnce(() => ({
        featureFlags: { pushNotifications: false }
      }))
      const mockUnsubscribeFromTopic = jest.fn()
      mockFirebaseMessaging.mockImplementation(() => ({ unsubscribeFromTopic: mockUnsubscribeFromTopic }))

      await PushNotificationsManager.unsubscribeNews('augsburg', 'de')
      expect(mockUnsubscribeFromTopic).not.toHaveBeenCalled()
    })

    it('should call unsubscribeFromTopic', async () => {
      mockBuildConfig.mockImplementationOnce(() => ({
        featureFlags: { pushNotifications: true }
      }))
      const mockUnsubscribeFromTopic = jest.fn()
      mockFirebaseMessaging.mockImplementation(() => ({ unsubscribeFromTopic: mockUnsubscribeFromTopic }))

      await PushNotificationsManager.unsubscribeNews('augsburg', 'de')
      expect(mockUnsubscribeFromTopic).toHaveBeenCalledWith('augsburg-de-news')
      expect(mockUnsubscribeFromTopic).toHaveBeenCalledTimes(1)
    })
  })

  describe('subscribeNews', () => {
    it('should return and do nothing if disabled in build configs', async () => {
      mockBuildConfig.mockImplementationOnce(() => ({
        featureFlags: { pushNotifications: false }
      }))
      const mockSubscribeToTopic = jest.fn()
      mockFirebaseMessaging.mockImplementation(() => ({ subscribeToTopic: mockSubscribeToTopic }))

      await PushNotificationsManager.subscribeNews('augsburg', 'de')
      expect(mockSubscribeToTopic).not.toHaveBeenCalled()
    })

    it('should call subscribeToTopic', async () => {
      mockBuildConfig.mockImplementationOnce(() => ({
        featureFlags: { pushNotifications: true }
      }))
      const mockSubscribeToTopic = jest.fn()
      mockFirebaseMessaging.mockImplementation(() => ({ subscribeToTopic: mockSubscribeToTopic }))

      await PushNotificationsManager.subscribeNews('augsburg', 'de')
      expect(mockSubscribeToTopic).toHaveBeenCalledWith('augsburg-de-news')
      expect(mockSubscribeToTopic).toHaveBeenCalledTimes(1)
    })
  })
})
