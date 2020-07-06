// @flow

import messaging from '@react-native-firebase/messaging'

const requestUserPermissionForPushNotifications = async () => {
  const authStatus = await messaging().requestPermission()

  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL

  if (enabled) {
    console.debug('Authorization status:', authStatus)
  }
}

const unSubscribeToPreviousCityTopic = async (prevCity, prevLanguage) => {
  messaging()
    .unsubscribeFromTopic(`${prevCity}-${prevLanguage}-news`)
    .then(() => console.debug(`Unsubscribed from ${prevCity}-${prevLanguage}-news topic!`))
}

const subscribeToNewCityTopic = async (newCity, newLanguage) => {
  messaging()
    .subscribeToTopic(`${newCity}-${newLanguage}-news`)
    .then(() => console.debug(`Subscribed to ${newCity}-${newLanguage}-news topic!`))
}

module.exports = {
  requestUserPermissionForPushNotifications,
  subscribeToNewCityTopic,
  unSubscribeToPreviousCityTopic
}
