import notifee, { EventType, AndroidImportance } from '@notifee/react-native'
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import { useEffect } from 'react'
import { Linking } from 'react-native'
import { checkNotifications, requestNotifications, RESULTS } from 'react-native-permissions'

import { LOCAL_NEWS_TYPE, NEWS_ROUTE, NonNullableRouteInformationType } from 'shared'

import { SnackbarType } from '../components/SnackbarContainer'
import { RoutesType } from '../constants/NavigationTypes'
import buildConfig from '../constants/buildConfig'
import urlFromRouteInformation from '../navigation/url'
import appSettings from './AppSettings'
import { log, reportError } from './sentry'

type Message = FirebaseMessagingTypes.RemoteMessage & {
  notification: { title: string }
  data: {
    city_code: string
    language_code: string
    news_id: string
  }
}

const WAITING_TIME_FOR_CMS = 1000

const importFirebaseMessaging = async (): Promise<() => FirebaseMessagingTypes.Module> =>
  import('@react-native-firebase/messaging').then(firebase => firebase.default)

export const pushNotificationsEnabled = (): boolean =>
  buildConfig().featureFlags.pushNotifications && !buildConfig().featureFlags.floss

export const requestPushNotificationPermission = async (): Promise<boolean> => {
  if (!pushNotificationsEnabled()) {
    log('Push notifications disabled, no permissions requested.')
    return false
  }

  const permissionStatus = (await requestNotifications(['alert'])).status
  log(`Notification permission status: ${permissionStatus}`)

  if (permissionStatus !== RESULTS.GRANTED) {
    log(`Permission denied, disabling push notifications in settings.`)
    await appSettings.setSettings({ allowPushNotifications: false })
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
    await messaging().unsubscribeFromTopic(topic)
  } catch (e) {
    reportError(e)
  }
  log(`Unsubscribed from ${topic} topic!`)
}
export const subscribeNews = async (city: string, language: string, skipSettingsCheck = false): Promise<void> => {
  try {
    const { allowPushNotifications } = await appSettings.loadSettings()
    if (!pushNotificationsEnabled() || (!allowPushNotifications && !skipSettingsCheck)) {
      log('Push notifications disabled, subscription skipped.')
      return
    }

    const topic = newsTopic(city, language)

    const messaging = await importFirebaseMessaging()
    await messaging().subscribeToTopic(topic)
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
const urlFromMessage = (message: Message): string => urlFromRouteInformation(routeInformationFromMessage(message))

export const useForegroundPushNotificationListener = ({
  showSnackbar,
  navigate,
}: {
  showSnackbar: (snackbar: SnackbarType) => void
  navigate: (route: RoutesType, params: Record<string, unknown>) => void
}): void =>
  useEffect(() => {
    let mounted = true
    importFirebaseMessaging().then(messaging =>
      messaging().onMessage(async _message => {
        const message = _message as Message
        if (mounted) {
          const androidChannelId = await notifee.createChannel({
            id: buildConfig().appName,
            name: buildConfig().appName,
            importance: AndroidImportance.HIGH,
          })

          await notifee.displayNotification({
            title: message.notification.title,
            body: message.notification.body,
            android: {
              smallIcon: buildConfig().notificationIcon,
              color: buildConfig().lightTheme.colors.themeColor,
              channelId: androidChannelId,
              importance: AndroidImportance.HIGH,
            },
          })
          notifee.onForegroundEvent(({ type }) => {
            if (type === EventType.PRESS) {
              // The CMS needs some time until the push notification is available in the API response
              setTimeout(() => {
                navigate(NEWS_ROUTE, routeInformationFromMessage(message))
              }, WAITING_TIME_FOR_CMS)
            }
          })
        }
      }),
    )
    return () => {
      mounted = false
    }
  }, [showSnackbar, navigate])

export const quitAppStatePushNotificationListener = async (
  navigateToDeepLink: (url: string) => void,
): Promise<void> => {
  const messaging = await importFirebaseMessaging()
  const message = (await messaging().getInitialNotification()) as Message | null

  if (message) {
    // Use navigateToDeepLink instead of normal navigation to avoid navigation not being initialized
    navigateToDeepLink(urlFromMessage(message))
  }
}

export const backgroundAppStatePushNotificationListener = (listener: (url: string) => void): (() => void) | void => {
  if (pushNotificationsEnabled()) {
    importFirebaseMessaging()
      .then(messaging => {
        const onReceiveURL = ({ url }: { url: string }) => listener(url)

        const onReceiveURLListener = Linking.addListener('url', onReceiveURL)

        const unsubscribeNotification = messaging().onNotificationOpenedApp(message =>
          listener(urlFromMessage(message as Message)),
        )

        return () => {
          onReceiveURLListener.remove()
          unsubscribeNotification()
        }
      })
      .catch(() => log('Failed to import firebase'))
  }

  return undefined
}

// Since Android 13 and iOS 17 an explicit permission request is needed, otherwise push notifications are not received.
// Therefore request the permissions once if not yet granted and subscribe to the current channel if successful.
// See https://github.com/digitalfabrik/integreat-app/issues/2438 and https://github.com/digitalfabrik/integreat-app/issues/2655
export const initialPushNotificationRequest = async (cityCode: string | null, languageCode: string): Promise<void> => {
  const { allowPushNotifications } = await appSettings.loadSettings()
  const pushNotificationPermissionGranted = (await checkNotifications()).status === RESULTS.GRANTED
  if (!pushNotificationPermissionGranted && allowPushNotifications) {
    const success = await requestPushNotificationPermission()
    if (success && cityCode) {
      await subscribeNews(cityCode, languageCode)
    }
  }
}
