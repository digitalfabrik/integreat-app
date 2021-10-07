import * as Sentry from '@sentry/react-native'
import { TFunction } from 'react-i18next'
import { AccessibilityRole, SectionListData } from 'react-native'
import { openSettings } from 'react-native-permissions'

import { JPAL_TRACKING_ROUTE, SettingsRouteType } from 'api-client'

import NativeConstants from '../constants/NativeConstants'
import { NavigationPropType } from '../constants/NavigationTypes'
import buildConfig from '../constants/buildConfig'
import { SettingsType } from './AppSettings'
import * as NotificationsManager from './PushNotificationsManager'
import { initSentry } from './helpers'
import openExternalUrl from './openExternalUrl'
import openPrivacyPolicy from './openPrivacyPolicy'

export type SetSettingFunctionType = (
  changeSetting: (settings: SettingsType) => Partial<SettingsType>,
  changeAction?: (newSettings: SettingsType) => Promise<void>
) => Promise<void>

export type SettingsSectionType = {
  title: string
  description?: string
  onPress: () => Promise<void>
  bigTitle?: boolean
  accessibilityRole?: AccessibilityRole
  hasSwitch?: boolean
  hasBadge?: boolean
  getSettingValue?: (settings: SettingsType) => boolean | null
}

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
  showSnackbar: (error: Error) => void
}

const createSettingsSections = ({
  setSetting,
  t,
  languageCode,
  cityCode,
  navigation,
  settings,
  showSnackbar
}: CreateSettingsSectionsPropsType): Readonly<Array<SectionListData<SettingsSectionType>>> => [
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
              onPress: async () => {
                setSetting(
                  settings => ({
                    allowPushNotifications: !settings.allowPushNotifications
                  }),
                  async newSettings => {
                    if (!cityCode) {
                      // No city selected so nothing to do here
                      return
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
        onPress: async () => {
          setSetting(
            settings => ({
              errorTracking: !settings.errorTracking
            }),
            async newSettings => {
              const client = Sentry.getCurrentHub().getClient()
              if (newSettings.errorTracking && !client) {
                initSentry()
              } else {
                if (client) {
                  client.getOptions().enabled = !!newSettings.errorTracking
                }
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
        onPress: async () => {
          const aboutUrls = buildConfig().aboutUrls
          const aboutUrl = aboutUrls[languageCode] || aboutUrls.default
          openExternalUrl(aboutUrl).catch(showSnackbar)
        }
      },
      {
        accessibilityRole: 'link',
        title: t('privacyPolicy'),
        onPress: () => openPrivacyPolicy(languageCode).catch(showSnackbar)
      },
      {
        title: t('version', {
          version: NativeConstants.appVersion
        }),
        onPress: async () => {
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
              title: t('tracking'),
              description: t('trackingDescription'),
              getSettingValue: (settings: SettingsType) => settings.jpalTrackingEnabled,
              hasBadge: true,
              onPress: async () => {
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
