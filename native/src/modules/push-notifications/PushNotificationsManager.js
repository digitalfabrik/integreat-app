// @flow

import messaging from '@react-native-firebase/messaging'
import type { FeatureFlagsType } from '../app/constants/buildConfig'
import { checkNotifications, RESULTS } from 'react-native-permissions'

export const checkPushNotificationPermission = async (): RESULTS => {
  const { status } = await checkNotifications()
  return status
}

export const requestPushNotificationPermission = async (featureFlags: FeatureFlagsType): Promise<void> => {
  if (!featureFlags.pushNotifications) {
    console.debug('Push notifications disabled, no permissions requested.')
    return
  }
  const authStatus = await messaging().requestPermission()
  console.debug('Authorization status:', authStatus)
}

const newsTopic = (city: string, language: string): string => `${city}-${language}-news`

export const unsubscribeNews = async (
  city: string, language: string, featureFlags: FeatureFlagsType
): Promise<void> => {
  if (!featureFlags.pushNotifications) {
    console.debug('Push notifications disabled, unsubscription skipped.')
    return
  }
  const topic = newsTopic(city, language)
  try {
    await messaging().unsubscribeFromTopic(topic)
  } catch (e) {
    console.error(e)
  }
  console.debug(`Unsubscribed from ${topic} topic!`)
}

export const subscribeNews = async (city: string, language: string, featureFlags: FeatureFlagsType): Promise<void> => {
  if (!featureFlags.pushNotifications) {
    console.debug('Push notifications disabled, subscription skipped.')
    return
  }
  const topic = newsTopic(city, language)
  try {
    await messaging().subscribeToTopic(topic)
  } catch (e) {
    console.error(e)
  }
  console.debug(`Subscribed to ${topic} topic!`)
}
