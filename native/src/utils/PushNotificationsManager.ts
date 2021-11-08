import messaging from '@react-native-firebase/messaging'

import buildConfig from '../constants/buildConfig'
import { log, reportError } from './sentry'

const pushNotificationsDisabled = (): boolean => !buildConfig().featureFlags.pushNotifications

export const requestPushNotificationPermission = async (): Promise<boolean> => {
  if (pushNotificationsDisabled()) {
    log('Push notifications disabled, no permissions requested.')
    return false
  }

  const authStatus = await messaging().requestPermission()
  log(`Authorization status: ${authStatus}`)
  // Firebase returns either 1 or 2 for granted or 0 for rejected permissions
  return authStatus !== 0
}

const newsTopic = (city: string, language: string): string => `${city}-${language}-news`

export const unsubscribeNews = async (city: string, language: string): Promise<void> => {
  if (pushNotificationsDisabled()) {
    log('Push notifications disabled, unsubscription skipped.')
    return
  }

  const topic = newsTopic(city, language)

  try {
    await messaging().unsubscribeFromTopic(topic)
  } catch (e) {
    reportError(e)
  }
  log(`Unsubscribed from ${topic} topic!`)
}
export const subscribeNews = async (city: string, language: string): Promise<void> => {
  if (pushNotificationsDisabled()) {
    log('Push notifications disabled, subscription skipped.')
    return
  }

  const topic = newsTopic(city, language)

  try {
    await messaging().subscribeToTopic(topic)
  } catch (e) {
    reportError(e)
  }
  log(`Subscribed to ${topic} topic!`)
}
