// @flow

import { createTrackingEndpoint, type SpecificSignalType } from 'api-client'
import AppSettings from '../settings/AppSettings'
import moment from 'moment'
import type { SettingsType } from '../settings/AppSettings'
import buildConfig from '../app/constants/buildConfig'
import { i18n } from '../i18n/components/I18nProvider'

const sendTrackingSignal = async ({ signal, offline = false }: {| signal: SpecificSignalType, offline?: boolean |}) => {
  try {
    const appSettings = new AppSettings()
    const settings: SettingsType = await appSettings.loadSettings()
    const {
      jpalTrackingEnabled,
      selectedCity,
      contentLanguage,
      allowPushNotifications,
      errorTracking,
      jpalTrackingCode
    } = settings

    const systemLanguage = i18n?.languages[0] ?? 'unknown'

    if (buildConfig().featureFlags.jpalTracking && jpalTrackingEnabled && jpalTrackingCode) {
      await createTrackingEndpoint().request({
        ...signal,
        trackingCode: jpalTrackingCode,
        offline,
        timestamp: moment().toISOString(),
        currentCity: selectedCity,
        currentLanguage: contentLanguage,
        systemLanguage,
        appSettings: {
          allowPushNotifications,
          errorTracking
        }
      })
    }
  } catch (e) {
    console.error(e)
  }
}

export default sendTrackingSignal
