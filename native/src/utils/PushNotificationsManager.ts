import notifee, { AndroidImportance, Event, EventType } from '@notifee/react-native'
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import { useEffect } from 'react'
import { checkNotifications, requestNotifications, RESULTS } from 'react-native-permissions'

import { LOCAL_NEWS_TYPE, NEWS_ROUTE, NonNullableRouteInformationType } from 'shared'

import { RoutesType } from '../constants/NavigationTypes'
import buildConfig from '../constants/buildConfig'
import { AppContextType } from '../contexts/AppContextProvider'
import urlFromRouteInformation from '../navigation/url'
import { log, reportError } from './sentry'

type UpdateSettingsType = (settings: { allowPushNotifications: boolean }) => void

type Message = FirebaseMessagingTypes.RemoteMessage & {
  notification: { title: string }
  data: {
    city_code: string
    language_code: string
    news_id: string
  }
}

const WAITING_TIME_FOR_CMS = 1000

const importFirebaseMessaging = async (): Promise<FirebaseMessagingTypes.Module> => {
  const { getMessaging } = await import('@react-native-firebase/messaging')
  return getMessaging()
}

export const pushNotificationsEnabled = (): boolean =>
  buildConfig().featureFlags.pushNotifications && !buildConfig().featureFlags.floss

export const requestPushNotificationPermission = async (updateSettings: UpdateSettingsType): Promise<boolean> => {
  if (!pushNotificationsEnabled()) {
    log('Push notifications disabled, no permissions requested.')
    return false
  }

  const permissionStatus = (await requestNotifications(['alert'])).status
  log(`Notification permission status: ${permissionStatus}`)

  if (permissionStatus !== RESULTS.GRANTED) {
    log(`Permission denied, disabling push notifications in settings.`)
    updateSettings({ allowPushNotifications: false })
  }

  return permissionStatus === RESULTS.GRANTED
}

const newsTopic = (city: string, language: string): string => `${city}-${language}-news`

export const unsubscribeNews = async (city: string, language: string): Promise<void> => {
  if (!pushNotificationsEnabled()) {
    log('Push notifications disabled, unsubscription skipped.')
    return
  }

  const topic = newsTopic(city, language)

  try {
    const messaging = await importFirebaseMessaging()
    await messaging.unsubscribeFromTopic(topic)
  } catch (e) {
    reportError(e)
  }
  log(`Unsubscribed from ${topic} topic!`)
}

type SubscribeNewsParams = {
  cityCode: string
  languageCode: string
  allowPushNotifications: boolean
  skipSettingsCheck?: boolean
}

export const subscribeNews = async ({
  cityCode,
  languageCode,
  allowPushNotifications,
  skipSettingsCheck = false,
}: SubscribeNewsParams): Promise<void> => {
  try {
    if (!pushNotificationsEnabled() || (!allowPushNotifications && !skipSettingsCheck)) {
      log('Push notifications disabled, subscription skipped.')
      return
    }

    const topic = newsTopic(cityCode, languageCode)

    const messaging = await importFirebaseMessaging()
    await messaging.subscribeToTopic(topic)
    log(`Subscribed to ${topic} topic!`)
  } catch (e) {
    reportError(e)
  }
}

const routeInformationFromMessage = (message: Message): NonNullableRouteInformationType => ({
  cityCode: message.data.city_code,
  languageCode: message.data.language_code,
  route: NEWS_ROUTE,
  newsType: LOCAL_NEWS_TYPE,
  newsId: parseInt(message.data.news_id, 10),
})

const notifeeEventHandler = (
  { type, detail }: Event,
  navigate: (route: RoutesType, params: Record<string, unknown>) => void,
): void => {
  if (type === EventType.PRESS) {
    // The CMS needs some time until the push notification is available in the API response
    setTimeout(
      () => navigate(NEWS_ROUTE, routeInformationFromMessage(detail.notification as Message)),
      WAITING_TIME_FOR_CMS,
    )
  }
}

const displayNotification = async (message: Message): Promise<void> => {
  const androidChannelId = await notifee.createChannel({
    id: buildConfig().appName,
    name: buildConfig().appName,
    importance: AndroidImportance.HIGH,
  })

  await notifee.displayNotification({
    title: message.notification.title,
    body: message.notification.body,
    data: message.data,
    android: {
      smallIcon: buildConfig().notificationIcon,
      color: buildConfig().legacyLightTheme.colors.themeColor,
      channelId: androidChannelId,
      importance: AndroidImportance.HIGH,
    },
  })
}

export const useNotificationListener = (navigate: (route: RoutesType, params: Record<string, unknown>) => void): void =>
  useEffect(() => {
    importFirebaseMessaging().then(messaging => {
      messaging.onMessage(async message => displayNotification(message as Message))
      messaging.setBackgroundMessageHandler(async message => displayNotification(message as Message))
    })
    notifee.onForegroundEvent(event => notifeeEventHandler(event, navigate))
    notifee.onBackgroundEvent(async event => notifeeEventHandler(event, navigate))
  }, [navigate])

export const getInitialNotificationUrl = async (onUrl: (url: string) => void): Promise<void> => {
  const initialNotification = await notifee.getInitialNotification()
  if (initialNotification) {
    onUrl(urlFromRouteInformation(routeInformationFromMessage(initialNotification.notification as Message)))
  }
}

// Since Android 13 and iOS 17 an explicit permission request is needed, otherwise push notifications are not received.
// Therefore request the permissions once if not yet granted and subscribe to the current channel if successful.
// See https://github.com/digitalfabrik/integreat-app/issues/2438 and https://github.com/digitalfabrik/integreat-app/issues/2655
export const initialPushNotificationRequest = async (appContext: AppContextType): Promise<void> => {
  const { cityCode, languageCode, settings, updateSettings } = appContext
  const { allowPushNotifications } = settings

  const pushNotificationPermissionGranted = (await checkNotifications()).status === RESULTS.GRANTED
  if (!pushNotificationPermissionGranted && allowPushNotifications) {
    const success = await requestPushNotificationPermission(updateSettings)
    if (success && cityCode) {
      await subscribeNews({ cityCode, languageCode, allowPushNotifications })
    }
  }
}
