import * as Sentry from '@sentry/react-native'
import { TFunction } from 'i18next'
import { Role } from 'react-native'
import { openSettings } from 'react-native-permissions'

import { CONSENT_ROUTE, JPAL_TRACKING_ROUTE, LICENSES_ROUTE, SettingsRouteType } from 'shared'

import { SnackbarType } from '../components/SnackbarContainer'
import NativeConstants from '../constants/NativeConstants'
import { NavigationProps } from '../constants/NavigationTypes'
import buildConfig from '../constants/buildConfig'
import { CityAppContext } from '../hooks/useCityAppContext'
import { SettingsType } from './AppSettings'
import {
  pushNotificationsEnabled,
  requestPushNotificationPermission,
  subscribeNews,
  unsubscribeNews,
} from './PushNotificationsManager'
import { initSentry } from './sentry'

export type SettingsSectionType = {
  title: string
  description?: string
  onPress: () => Promise<void> | void
  bigTitle?: boolean
  role?: Role
  hasBadge?: boolean
  getSettingValue?: (settings: SettingsType) => boolean | null
}

const volatileValues = {
  versionTaps: 0,
}

const TRIGGER_VERSION_TAPS = 25

type CreateSettingsSectionsProps = {
  appContext: CityAppContext
  navigation: NavigationProps<SettingsRouteType>
  showSnackbar: (snackbar: SnackbarType) => void
  t: TFunction<'error'>
}

const createSettingsSections = ({
  appContext: { settings, updateSettings, cityCode, languageCode },
  navigation,
  showSnackbar,
  t,
}: CreateSettingsSectionsProps): (SettingsSectionType | null)[] => [
  pushNotificationsEnabled()
    ? {
        title: t('pushNewsTitle'),
        description: t('pushNewsDescription'),
        getSettingValue: (settings: SettingsType) => settings.allowPushNotifications,
        onPress: async () => {
          const newAllowPushNotifications = !settings.allowPushNotifications
          updateSettings({ allowPushNotifications: newAllowPushNotifications })
          if (!newAllowPushNotifications) {
            await unsubscribeNews(cityCode, languageCode)
            return
          }

          const status = await requestPushNotificationPermission(updateSettings)

          if (status) {
            await subscribeNews({
              cityCode,
              languageCode,
              allowPushNotifications: newAllowPushNotifications,
              skipSettingsCheck: true,
            })
          } else {
            updateSettings({ allowPushNotifications: false })
            // If the user has rejected the permission once, it can only be changed in the system settings
            showSnackbar({
              text: 'permissionRequired',
              positiveAction: {
                label: t('layout:settings'),
                onPress: openSettings,
              },
            })
          }
        },
      }
    : null,
  {
    title: t('sentryTitle'),
    description: t('sentryDescription', { appName: buildConfig().appName }),
    getSettingValue: (settings: SettingsType) => settings.errorTracking,
    onPress: async () => {
      const newErrorTracking = !settings.errorTracking
      updateSettings({ errorTracking: newErrorTracking })

      const client = Sentry.getClient()
      if (newErrorTracking && !client) {
        initSentry()
      } else if (client) {
        client.getOptions().enabled = newErrorTracking
      }
    },
  },
  {
    title: t('externalResourcesTitle'),
    description: t('externalResourcesDescription'),
    onPress: () => navigation.navigate(CONSENT_ROUTE),
  },
  {
    title: t('version', { version: NativeConstants.appVersion }),
    onPress: () => {
      volatileValues.versionTaps += 1

      if (volatileValues.versionTaps === TRIGGER_VERSION_TAPS) {
        volatileValues.versionTaps = 0
        throw Error('This error was thrown for testing purposes. Please ignore this error.')
      }
    },
  },
  buildConfig().featureFlags.jpalTracking && settings.jpalTrackingCode
    ? {
        title: t('tracking'),
        description: t('trackingShortDescription', { appName: buildConfig().appName }),
        getSettingValue: (settings: SettingsType) => settings.jpalTrackingEnabled,
        hasBadge: true,
        onPress: () => {
          navigation.navigate(JPAL_TRACKING_ROUTE)
        },
      }
    : null,
]

export default createSettingsSections
