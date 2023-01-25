import { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import { useEffect } from 'react'
import { Linking } from 'react-native'

import { LOCAL_NEWS_TYPE, NEWS_ROUTE, NonNullableRouteInformationType } from 'api-client'

import { SnackbarType } from '../components/Snackbar'
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
const SHOW_DURATION = 10000

const importFirebaseMessaging = async (): Promise<() => FirebaseMessagingTypes.Module> =>
  import('@react-native-firebase/messaging').then(firebase => firebase.default)

export const pushNotificationsEnabled = (): boolean =>
  buildConfig().featureFlags.pushNotifications && !buildConfig().featureFlags.floss

export const requestPushNotificationPermission = async (): Promise<boolean> => {
  if (!pushNotificationsEnabled()) {
    log('Push notifications disabled, no permissions requested.')
    return false
  }

  const messaging = await importFirebaseMessaging()
  const authStatus = await messaging().requestPermission()
  log(`Authorization status: ${authStatus}`)
  // Firebase returns either 1 or 2 for granted or 0 for rejected permissions
  return authStatus !== 0
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
export const subscribeNews = async (city: string, language: string): Promise<void> => {
  try {
    const { allowPushNotifications } = await appSettings.loadSettings()
    if (!pushNotificationsEnabled() || !allowPushNotifications) {
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
  newsId: message.data.news_id,
})
const urlFromMessage = (message: Message): string => urlFromRouteInformation(routeInformationFromMessage(message))

export const useForegroundPushNotificationListener = ({
  showSnackbar,
  navigate,
}: {
  showSnackbar: (snackbar: SnackbarType, showDuration?: number) => void
  navigate: (route: RoutesType, params: Record<string, unknown>) => void
}): void =>
  useEffect(() => {
    let mounted = true
    importFirebaseMessaging().then(messaging =>
      messaging().onMessage(async _message => {
        const message = _message as Message
        if (mounted) {
          // The CMS needs some time until the push notification is available in the API response
          setTimeout(() => {
            // TODO IGAPP-1024: Uncomment and improve snackbar
            log(JSON.stringify(message))
            // showSnackbar(
            //   {
            //     text: message.notification.title,
            //     positiveAction: {
            //       onPress: () => navigate(NEWS_ROUTE, routeInformationFromMessage(message)),
            //       label: 'Show',
            //     },
            //   },
            //   SHOW_DURATION
            // )
          }, WAITING_TIME_FOR_CMS)
        }
      })
    )
    return () => {
      mounted = false
    }
  }, [showSnackbar, navigate])

export const quitAppStatePushNotificationListener = async (
  navigateToDeepLink: (url: string) => void
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
          listener(urlFromMessage(message as Message))
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
