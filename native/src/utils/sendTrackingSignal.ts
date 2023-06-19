import { DateTime } from 'luxon'

import { createTrackingEndpoint, ErrorCode, fromError, SpecificSignalType, SignalType } from 'api-client'

import buildConfig from '../constants/buildConfig'
import appSettings from './AppSettings'
import { reportError } from './sentry'

let systemLanguage: string | null = null
export const setSystemLanguage = (language: string): void => {
  systemLanguage = language
}
export const sendRequest = async (signal: SignalType): Promise<void> => {
  try {
    const { jpalTrackingCode, jpalTrackingEnabled } = await appSettings.loadSettings()

    if (buildConfig().featureFlags.jpalTracking && jpalTrackingEnabled && jpalTrackingCode) {
      await createTrackingEndpoint().request(signal)
    }
  } catch (e) {
    if (fromError(e) === ErrorCode.NetworkConnectionFailed) {
      // Offline usage, save signal to be sent later
      await appSettings.pushJpalSignal({ ...signal, offline: true })
    } else {
      reportError(e)
    }
  }
}

const sendTrackingSignal = async ({
  signal: specificSignal,
  offline = false,
}: {
  signal: SpecificSignalType
  offline?: boolean
}): Promise<void> => {
  try {
    const settings = await appSettings.loadSettings()
    const { selectedCity, contentLanguage, allowPushNotifications, errorTracking, jpalTrackingCode } = settings
    if (jpalTrackingCode) {
      const signal: SignalType = {
        ...specificSignal,
        trackingCode: jpalTrackingCode,
        offline,
        timestamp: DateTime.now().toJSDate().toISOString(),
        currentCity: selectedCity,
        currentLanguage: contentLanguage,
        systemLanguage: systemLanguage ?? 'unknown',
        appSettings: {
          allowPushNotifications,
          errorTracking,
        },
      }
      await sendRequest(signal)
    }
  } catch (e) {
    reportError(e)
  }
}

export default sendTrackingSignal
