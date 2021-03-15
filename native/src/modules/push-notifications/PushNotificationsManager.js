// @flow

import messaging from '@react-native-firebase/messaging'
import { checkNotifications, RESULTS } from 'react-native-permissions'
import type { FeatureFlagsType } from 'build-configs/BuildConfigType'
import buildConfig from '../app/constants/buildConfig'

export const checkPushNotificationPermission = async (): RESULTS => {
  if (!buildConfig().featureFlags.pushNotifications) {
    return RESULTS.UNAVAILABLE
  }
  const { status } = await checkNotifications()
  return status
}

export const requestPushNotificationPermission = async (): Promise<void> => {
  if (!buildConfig().featureFlags.pushNotifications) {
    console.debug('Push notifications disabled, no permissions requested.')
    return
  }
  const authStatus = await messaging().requestPermission()
  console.debug('Authorization status:', authStatus)
}

const newsTopic = (city: string, language: string): string => `${city}-${language}-news`

export const unsubscribeNews = async (
  city: string,
  language: string,
  featureFlags: FeatureFlagsType
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
