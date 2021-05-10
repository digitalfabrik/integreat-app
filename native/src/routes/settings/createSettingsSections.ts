import { $Shape } from 'utility-types'
import { TFunction } from 'react-i18next'
import 'react-i18next'
import NativeConstants from '../../modules/native-constants/NativeConstants'
import { SettingsType } from '../../modules/settings/AppSettings'
import openPrivacyPolicy from './openPrivacyPolicy'
import buildConfig from '../../modules/app/constants/buildConfig'
import * as Sentry from '@sentry/react-native'
import * as NotificationsManager from '../../modules/push-notifications/PushNotificationsManager'
import initSentry from '../../modules/app/initSentry'
import openExternalUrl from '../../modules/common/openExternalUrl'
import { SettingsRouteType } from 'api-client'
import { JPAL_TRACKING_ROUTE } from 'api-client'
import { NavigationPropType } from '../../modules/app/constants/NavigationTypes'
import { openSettings } from 'react-native-permissions'
export type SetSettingFunctionType = (
  changeSetting: (settings: SettingsType) => $Shape<SettingsType>,
  changeAction?: (newSettings: SettingsType) => Promise<void>
) => Promise<void>
const volatileValues = {
  versionTaps: 0
}
const TRIGGER_VERSION_TAPS = 25
type CreateSettingsSectionsPropsType = {
  setSetting: SetSettingFunctionType
  t: TFunction
  languageCode: string
  cityCode: string | null | undefined
  navigation: NavigationPropType<SettingsRouteType>
  settings: SettingsType
  showSnackbar: (arg0: string) => void
}

const createSettingsSections = ({
  setSetting,
  t,
  languageCode,
  cityCode,
  navigation,
  settings,
  showSnackbar
}: CreateSettingsSectionsPropsType) => [
  {
    title: null,
    data: [
      ...(!buildConfig().featureFlags.pushNotifications
        ? []
        : [
            {
              title: t('pushNewsTitle'),
              description: t('pushNewsDescription'),
              hasSwitch: true,
              getSettingValue: (settings: SettingsType) => settings.allowPushNotifications,
              onPress: () => {
                setSetting(
                  settings => ({
                    allowPushNotifications: !settings.allowPushNotifications
                  }),
                  async newSettings => {
                    if (!cityCode) {
                      // No city selected so nothing to do here
                      return
                    }

                    if (!NotificationsManager.pushNotificationsSupported()) {
                      showSnackbar('notSupportedByDevice')
                      // Reset displayed setting in app
                      throw new Error('Not supported by device')
                    }

                    if (newSettings.allowPushNotifications) {
                      const status = await NotificationsManager.requestPushNotificationPermission()

                      if (status) {
                        await NotificationsManager.subscribeNews(cityCode, languageCode)
                      } else {
                        // If the user has rejected the permission once, it can only be changed in the system settings
                        openSettings()
                        // Reset displayed setting in app
                        throw new Error('No permission for Push Notifications')
                      }
                    } else {
                      if (!NotificationsManager.pushNotificationsSupported()) {
                        throw new Error('Not supported by device')
                      }

                      await NotificationsManager.unsubscribeNews(cityCode, languageCode)
                    }
                  }
                )
              }
            }
          ]),
      {
        title: t('sentryTitle'),
        description: t('sentryDescription', {
          appName: buildConfig().appName
        }),
        hasSwitch: true,
        getSettingValue: (settings: SettingsType) => settings.errorTracking,
        onPress: () => {
          setSetting(
            settings => ({
              errorTracking: !settings.errorTracking
            }),
            async newSettings => {
              if (newSettings.errorTracking && !Sentry.getCurrentHub().getClient()) {
                initSentry()
              } else {
                Sentry.getCurrentHub().getClient().getOptions().enabled = newSettings.errorTracking
              }
            }
          )
        }
      },
      {
        accessibilityRole: 'link',
        title: t('about', {
          appName: buildConfig().appName
        }),
        onPress: () => {
          const aboutUrls = buildConfig().aboutUrls
          const aboutUrl = aboutUrls[languageCode] || aboutUrls.default
          openExternalUrl(aboutUrl)
        }
      },
      {
        accessibilityRole: 'link',
        title: t('privacyPolicy'),
        onPress: () => openPrivacyPolicy(languageCode)
      },
      {
        accessibilityRole: 'none',
        title: t('version', {
          version: NativeConstants.appVersion
        }),
        onPress: () => {
          volatileValues.versionTaps++

          if (volatileValues.versionTaps === TRIGGER_VERSION_TAPS) {
            volatileValues.versionTaps = 0
            throw Error('This error was thrown for testing purposes. Please ignore this error.')
          }
        }
      },
      ...(!buildConfig().featureFlags.jpalTracking
        ? []
        : [
            {
              accessibilityRole: 'none',
              title: t('tracking'),
              description: t('trackingDescription'),
              getSettingValue: (settings: SettingsType) => settings.jpalTrackingEnabled,
              hasBadge: true,
              onPress: () => {
                navigation.navigate(JPAL_TRACKING_ROUTE, {
                  trackingCode: settings.jpalTrackingCode
                })
              }
            }
          ])
    ]
  }
]

export default createSettingsSections
