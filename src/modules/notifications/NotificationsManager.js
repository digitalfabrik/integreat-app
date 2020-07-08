// @flow

import messaging from '@react-native-firebase/messaging'

export const requestPushNotificationPermission = async () => {
  const authStatus = await messaging().requestPermission()
  console.debug('Authorization status:', authStatus)
}

export const unsubscribeFromPreviousCity = async (prevCity, prevLanguage) => {
  messaging()
    .unsubscribeFromTopic(`${prevCity}-${prevLanguage}-news`)
    .then(() => console.debug(`Unsubscribed from ${prevCity}-${prevLanguage}-news topic!`))
}

export const subscribeToCity = async (newCity, newLanguage) => {
  messaging()
    .subscribeToTopic(`${newCity}-${newLanguage}-news`)
    .then(() => console.debug(`Subscribed to ${newCity}-${newLanguage}-news topic!`))
}
