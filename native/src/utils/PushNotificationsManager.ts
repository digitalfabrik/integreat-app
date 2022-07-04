import { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import { Linking } from 'react-native'
import { Dispatch } from 'redux'

import { LOCAL_NEWS_TYPE, NEWS_ROUTE } from 'api-client'

import { NavigationPropType, RoutesType } from '../constants/NavigationTypes'
import buildConfig from '../constants/buildConfig'
import navigateToDeepLink from '../navigation/navigateToDeepLink'
import urlFromRouteInformation from '../navigation/url'
import { log, reportError } from './sentry'

type Message = FirebaseMessagingTypes.RemoteMessage & {
  data: {
    city_code: string
    language_code: string
    group: string
    news_id: string
  }
}

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
  if (!pushNotificationsEnabled()) {
    log('Push notifications disabled, subscription skipped.')
    return
  }

  const topic = newsTopic(city, language)

  try {
    const messaging = await importFirebaseMessaging()
    await messaging().subscribeToTopic(topic)
  } catch (e) {
    reportError(e)
  }
  log(`Subscribed to ${topic} topic!`)
}

export const quitAppStatePushNotificationListener = async (
  dispatch: Dispatch,
  navigation: NavigationPropType<RoutesType>
): Promise<void> => {
  const messaging = await importFirebaseMessaging()
  const message = await messaging().getInitialNotification()

  if (message) {
    const { city_code: cityCode, language_code: languageCode, news_id: newsId } = (message as Message).data
    // Use navigateToDeepLink instead of normal createNavigate to avoid navigation not being initialized
    const url = urlFromRouteInformation({
      cityCode,
      languageCode,
      route: NEWS_ROUTE,
      newsType: LOCAL_NEWS_TYPE,
      newsId
    })
    navigateToDeepLink(dispatch, navigation, url, languageCode)
  }
}

export const backgroundAppStatePushNotificationListener = (listener: (url: string) => void): (() => void) | void => {
  if (pushNotificationsEnabled()) {
    importFirebaseMessaging()
      .then(messaging => {
        const onReceiveURL = ({ url }: { url: string }) => listener(url)

        const onReceiveURLListener = Linking.addListener('url', onReceiveURL)

        const unsubscribeNotification = messaging().onNotificationOpenedApp(message => {
          const { city_code: cityCode, language_code: languageCode, news_id: newsId } = (message as Message).data
          listener(
            urlFromRouteInformation({
              cityCode,
              languageCode,
              route: NEWS_ROUTE,
              newsType: LOCAL_NEWS_TYPE,
              newsId
            })
          )
        })

        return () => {
          onReceiveURLListener.remove()
          unsubscribeNotification()
        }
      })
      .catch(() => log('Failed to import firebase'))
  }

  return undefined
}
