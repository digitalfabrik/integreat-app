// @flow

import { createTrackingEndpoint, type SpecificSignalType } from 'api-client'
import AppSettings from '../settings/AppSettings'
import moment from 'moment'
import buildConfig from '../app/constants/buildConfig'
import ErrorCodes, { fromError } from '../error/ErrorCodes'
import type { SignalType } from 'api-client'

export const sendRequest = async (signal: SignalType) => {
  const appSettings = new AppSettings()
  try {
    const { jpalTrackingCode, jpalTrackingEnabled } = await appSettings.loadSettings()

    if (buildConfig().featureFlags.jpalTracking && jpalTrackingEnabled && jpalTrackingCode) {
      await createTrackingEndpoint().request(signal)
    }
  } catch (e) {
    if (fromError(e) === ErrorCodes.NetworkConnectionFailed) {
      // Offline usage, save signal to be sent later
      await appSettings.pushJpalSignal({ ...signal, offline: true })
    } else {
      console.error(e)
      // TODO IGAPP-572 Send to sentry
    }
  }
}

const sendTrackingSignal = async ({
  signal: specificSignal,
  offline = false
}: {|
  signal: SpecificSignalType,
  offline?: boolean
|}) => {
  const appSettings = new AppSettings()
  try {
    const settings = await appSettings.loadSettings()
    const { selectedCity, contentLanguage, allowPushNotifications, errorTracking, jpalTrackingCode } = settings

    const signal: SignalType = {
      ...specificSignal,
      trackingCode: jpalTrackingCode,
      offline,
      timestamp: moment().toISOString(),
      currentCity: selectedCity,
      currentLanguage: contentLanguage,
      systemLanguage: '', // TODO IGAPP-566 Include system language
      appSettings: {
        allowPushNotifications,
        errorTracking
      }
    }

    await sendRequest(signal)
  } catch (e) {
    console.error(e)
  }
}

export default sendTrackingSignal
