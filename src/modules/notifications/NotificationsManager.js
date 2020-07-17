// @flow

import messaging from '@react-native-firebase/messaging'

export const requestPushNotificationPermission = async (): Promise<void> => {
  const authStatus = await messaging().requestPermission()
  console.debug('Authorization status:', authStatus)
}

export const unsubscribeFromPreviousCity = async (prevCity: string, prevLanguage: string): Promise<void> => {
  try {
    await messaging().unsubscribeFromTopic(`${prevCity}-${prevLanguage}-news`)
  } catch (e) {
    console.error(e)
  }
  console.debug(`Unsubscribed from ${prevCity}-${prevLanguage}-news topic!`)
}

export const subscribeToCity = async (newCity: string, newLanguage: string): Promise<void> => {
  try {
    await messaging().subscribeToTopic(`${newCity}-${newLanguage}-news`)
  } catch (e) {
    console.error(e)
  }
  console.debug(`Subscribed to ${newCity}-${newLanguage}-news topic!`)
}
