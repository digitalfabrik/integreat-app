import notifee, { AndroidImportance, Event, EventType } from '@notifee/react-native'
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import { useEffect } from 'react'
import { checkNotifications, requestNotifications, RESULTS } from 'react-native-permissions'

import { LOCAL_NEWS_TYPE, NEWS_ROUTE, NonNullableRouteInformationType } from 'shared'

import { RoutesType } from '../constants/NavigationTypes'
import buildConfig from '../constants/buildConfig'
import { AppContextType } from '../contexts/AppContextProvider'
import { useAppContext } from '../hooks/useCityAppContext'
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
    const { getMessaging, unsubscribeFromTopic } = await import('@react-native-firebase/messaging')
    await unsubscribeFromTopic(getMessaging(), topic)
    log(`Unsubscribed from ${topic} topic!`)
  } catch (e) {
    reportError(e)
  }
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

    const { getMessaging, subscribeToTopic } = await import('@react-native-firebase/messaging')
    await subscribeToTopic(getMessaging(), topic)
    log(`Subscribed to ${topic} topic!`)
  } catch (e) {
    reportError(e)
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

const pushNotificationListener = async () => {
  const { getMessaging, onMessage, setBackgroundMessageHandler } = await import('@react-native-firebase/messaging')
  // Foreground notifications
  onMessage(getMessaging(), message => displayNotification(message as Message))
  // It is not necessary to set a background message handler as the notification is automatically displayed by the OS
  // Set one anyway to avoid the warning that no background message handler is set
  setBackgroundMessageHandler(getMessaging(), async () => undefined)
}

const routeInformationFromMessage = (message: Message): NonNullableRouteInformationType => ({
  cityCode: message.data.city_code,
  languageCode: message.data.language_code,
  route: NEWS_ROUTE,
  newsType: LOCAL_NEWS_TYPE,
  newsId: parseInt(message.data.news_id, 10),
})

const openMessage = (message: Message, navigate: (route: RoutesType, params: unknown) => void): void => {
  // The CMS needs some time until the push notification is available in the API response
  setTimeout(() => navigate(NEWS_ROUTE, routeInformationFromMessage(message)), WAITING_TIME_FOR_CMS)
}

const notifeeEventHandler = ({ type, detail }: Event, navigate: (route: RoutesType, params: unknown) => void): void => {
  if (type === EventType.PRESS) {
    openMessage(detail.notification as Message, navigate)
  }
}

const pushNotificationPressListener = async (navigate: (route: RoutesType, params: unknown) => void) => {
  const { getMessaging, onNotificationOpenedApp, getInitialNotification } = await import(
    '@react-native-firebase/messaging'
  )
  // FCM quit state notifications
  const initialMessage = await getInitialNotification(getMessaging())
  if (initialMessage) {
    openMessage(initialMessage as Message, navigate)
  }
  // FCM background notifications
  onNotificationOpenedApp(getMessaging(), message => openMessage(message as Message, navigate))
  // Notifee foreground notifications
  notifee.onForegroundEvent(event => notifeeEventHandler(event, navigate))
  notifee.onBackgroundEvent(async event => notifeeEventHandler(event, navigate))
}

// Since Android 13 and iOS 17 an explicit permission request is needed, otherwise push notifications are not received.
// Therefore, request the permissions once if not yet granted and subscribe to the current channel if successful.
// See https://github.com/digitalfabrik/integreat-app/issues/2438 and https://github.com/digitalfabrik/integreat-app/issues/2655
const initialPushNotificationRequest = async (appContext: AppContextType): Promise<void> => {
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

export const usePushNotificationListener = (navigate: (route: RoutesType, params: unknown) => void): void => {
  const appContext = useAppContext()

  useEffect(() => {
    initialPushNotificationRequest(appContext).catch(reportError)
  }, [appContext])

  useEffect(() => {
    pushNotificationListener().catch(reportError)
  }, [])

  useEffect(() => {
    pushNotificationPressListener(navigate).catch(reportError)
  }, [navigate])
}
