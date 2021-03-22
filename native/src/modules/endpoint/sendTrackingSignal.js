// @flow

import { createTrackingEndpoint, type SpecificSignalType } from 'api-client'
import AppSettings from '../settings/AppSettings'
import moment from 'moment'
import type { SettingsType } from '../settings/AppSettings'

const sendTrackingSignal = async ({ signal, offline = false }: {| signal: SpecificSignalType, offline?: boolean |}) => {
  try {
    const appSettings = new AppSettings()
    const settings: SettingsType = await appSettings.loadSettings()
    const {
      jpalTrackingEnabled,
      selectedCity,
      contentLanguage,
      allowPushNotifications,
      proposeNearbyCities,
      errorTracking,
      jpalTrackingCode
    } = settings

    if (jpalTrackingCode && jpalTrackingEnabled) {
      await createTrackingEndpoint().request({
        ...signal,
        trackingCode: jpalTrackingCode,
        metadata: {
          offline,
          timestamp: moment().toISOString(),
          currentCity: selectedCity,
          currentLanguage: contentLanguage,
          systemLanguage: '',
          appSettings: {
            allowPushNotifications,
            proposeNearbyCities,
            errorTracking
          }
        }
      })
    }
  } catch (e) {
    console.error(e)
  }
}

export default sendTrackingSignal
