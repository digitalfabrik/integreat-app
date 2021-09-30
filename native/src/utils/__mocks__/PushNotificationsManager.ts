export const requestPushNotificationPermission = async (): Promise<void> => {
  // eslint-disable-next-line no-console
  console.debug('Authorization status:', 'UNKNOWN')
}
export const unsubscribeNews = async (prevCity: string, prevLanguage: string): Promise<void> => {
  // eslint-disable-next-line no-console
  console.debug(`Unsubscribed from ${prevCity}-${prevLanguage}-news topic!`)
}
export const subscribeNews = async (newCity: string, newLanguage: string): Promise<void> => {
  // eslint-disable-next-line no-console
  console.debug(`Subscribed to ${newCity}-${newLanguage}-news topic!`)
}
export const checkPushNotificationPermission = async (): Promise<string> => 'blocked'
