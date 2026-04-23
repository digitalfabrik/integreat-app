export const requestPushNotificationPermission = async (): Promise<void> => {
  console.debug('Authorization status:', 'UNKNOWN')
}
export const unsubscribeNews = async (prevRegion: string, prevLanguage: string): Promise<void> => {
  console.debug(`Unsubscribed from ${prevRegion}-${prevLanguage}-news topic!`)
}
export const subscribeNews = async (newRegion: string, newLanguage: string): Promise<void> => {
  console.debug(`Subscribed to ${newRegion}-${newLanguage}-news topic!`)
}
export const checkPushNotificationPermission = async (): Promise<string> => 'blocked'
