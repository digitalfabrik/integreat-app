// @flow

export const requestPushNotificationPermission = async (): Promise<void> => {
  console.debug('Authorization status:', 'UNKNOWN')
}

export const unsubscribeNews = async (prevCity: string, prevLanguage: string): Promise<void> => {
  console.debug(`Unsubscribed from ${prevCity}-${prevLanguage}-news topic!`)
}

export const subscribeNews = async (newCity: string, newLanguage: string): Promise<void> => {
  console.debug(`Subscribed to ${newCity}-${newLanguage}-news topic!`)
}

export const checkPushNotificationPermission = async (): Promise<string> => {
  return 'blocked'
}
