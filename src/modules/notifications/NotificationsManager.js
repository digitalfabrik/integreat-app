// @flow

import messaging from '@react-native-firebase/messaging'

export const requestPushNotificationPermission = async (): Promise<void> => {
  const authStatus = await messaging().requestPermission()
  console.debug('Authorization status:', authStatus)
}

const newsTopic = (city: string, language: string): string => `${city}-${language}-news`

export const unsubscribeNews = async (city: string, language: string): Promise<void> => {
  const topic = newsTopic(city, language)
  try {
    await messaging().unsubscribeFromTopic(topic)
  } catch (e) {
    console.error(e)
  }
  console.debug(`Unsubscribed from ${topic} topic!`)
}

export const subscribeNews = async (city: string, language: string): Promise<void> => {
  const topic = newsTopic(city, language)
  try {
    await messaging().subscribeToTopic(topic)
  } catch (e) {
    console.error(e)
  }
  console.debug(`Subscribed to ${topic} topic!`)
}
