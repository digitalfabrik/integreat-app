import { getMessaging, subscribeToTopic, unsubscribeFromTopic } from '@react-native-firebase/messaging'

import { log, reportError } from './sentry'

const newsTopic = (region: string, language: string): string => `${region}-${language}-news`

export const unsubscribeNews = async (region: string, language: string): Promise<void> => {
  const topic = newsTopic(region, language)

  try {
    await unsubscribeFromTopic(getMessaging(), topic)
    log(`Unsubscribed from ${topic} topic!`)
  } catch (e) {
    reportError(e)
  }
}

type SubscribeNewsParams = {
  regionCode: string
  languageCode: string
  allowPushNotifications: boolean
  skipSettingsCheck?: boolean
}

export const subscribeNews = async ({
  regionCode,
  languageCode,
  allowPushNotifications,
  skipSettingsCheck = false,
}: SubscribeNewsParams): Promise<void> => {
  try {
    if (!allowPushNotifications && !skipSettingsCheck) {
      log('Push notifications disabled, subscription skipped.')
      return
    }

    const topic = newsTopic(regionCode, languageCode)
    await subscribeToTopic(getMessaging(), topic)
    log(`Subscribed to ${topic} topic!`)
  } catch (e) {
    reportError(e)
  }
}
