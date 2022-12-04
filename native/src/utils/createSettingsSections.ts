import * as Sentry from '@sentry/react-native'
import { TFunction } from 'react-i18next'
import { AccessibilityRole, SectionListData } from 'react-native'
import { openSettings } from 'react-native-permissions'

import { JPAL_TRACKING_ROUTE, LICENSES_ROUTE, SettingsRouteType } from 'api-client'

import NativeConstants from '../constants/NativeConstants'
import { NavigationProps } from '../constants/NavigationTypes'
import buildConfig from '../constants/buildConfig'
import { SettingsType } from './AppSettings'
import * as NotificationsManager from './PushNotificationsManager'
import { pushNotificationsEnabled } from './PushNotificationsManager'
import openExternalUrl from './openExternalUrl'
import openPrivacyPolicy from './openPrivacyPolicy'
import { initSentry } from './sentry'

export type SetSettingFunctionType = (
  changeSetting: (settings: SettingsType) => Partial<SettingsType>,
  changeAction?: (newSettings: SettingsType) => Promise<boolean>
) => Promise<void>

export type SettingsSectionType = {
  title: string
  description?: string
  onPress: () => void
  bigTitle?: boolean
  accessibilityRole?: AccessibilityRole
  hasSwitch?: boolean
  hasBadge?: boolean
  getSettingValue?: (settings: SettingsType) => boolean | null
}

const volatileValues = {
  versionTaps: 0,
}

const TRIGGER_VERSION_TAPS = 25

type CreateSettingsSectionsProps = {
  setSetting: SetSettingFunctionType
  t: TFunction
  languageCode: string
  cityCode: string | null | undefined
  navigation: NavigationProps<SettingsRouteType>
  settings: SettingsType
  showSnackbar: ({ text }: { text: string }) => void
}

const createSettingsSections = ({
  setSetting,
  t,
  languageCode,
  cityCode,
  navigation,
  settings,
  showSnackbar,
}: CreateSettingsSectionsProps): Readonly<Array<SectionListData<SettingsSectionType>>> => [
  {
    title: null,
    data: [
      ...(!pushNotificationsEnabled()
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
                    allowPushNotifications: !settings.allowPushNotifications,
                  }),
                  async (newSettings): Promise<boolean> => {
                    if (!cityCode) {
                      // No city selected so nothing to do here
                      return true
                    }

                    if (newSettings.allowPushNotifications) {
                      const status = await NotificationsManager.requestPushNotificationPermission()

                      if (status) {
                        await NotificationsManager.subscribeNews(cityCode, languageCode)
                      } else {
                        // If the user has rejected the permission once, it can only be changed in the system settings
                        openSettings()
                        // Not successful, reset displayed setting in app
                        return false
                      }
                    } else {
                      await NotificationsManager.unsubscribeNews(cityCode, languageCode)
                    }
                    return true
                  }
                )
              },
            },
          ]),
      {
        title: t('sentryTitle'),
        description: t('sentryDescription', {
          appName: buildConfig().appName,
        }),
        hasSwitch: true,
        getSettingValue: (settings: SettingsType) => settings.errorTracking,
        onPress: () => {
          setSetting(
            settings => ({
              errorTracking: !settings.errorTracking,
            }),
            async newSettings => {
              const client = Sentry.getCurrentHub().getClient()
              if (newSettings.errorTracking && !client) {
                initSentry()
              } else if (client) {
                client.getOptions().enabled = !!newSettings.errorTracking
              }
              return true
            }
          )
        },
      },
      {
        accessibilityRole: 'link',
        title: t('about', {
          appName: buildConfig().appName,
        }),
        onPress: () => {
          const { aboutUrls } = buildConfig()
          const aboutUrl = aboutUrls[languageCode] || aboutUrls.default
          openExternalUrl(aboutUrl).catch((error: Error) => showSnackbar({ text: error.message }))
        },
      },
      {
        accessibilityRole: 'link',
        title: t('privacyPolicy'),
        onPress: () => openPrivacyPolicy(languageCode).catch((error: Error) => showSnackbar({ text: error.message })),
      },
      {
        title: t('version', {
          version: NativeConstants.appVersion,
        }),
        onPress: () => {
          volatileValues.versionTaps += 1

          if (volatileValues.versionTaps === TRIGGER_VERSION_TAPS) {
            volatileValues.versionTaps = 0
            throw Error('This error was thrown for testing purposes. Please ignore this error.')
          }
        },
      },
      {
        title: t('openSourceLicenses'),
        onPress: () => navigation.navigate(LICENSES_ROUTE),
      },
      // Only show the jpal tracking setting for users that opened it via deep link before
      ...(buildConfig().featureFlags.jpalTracking && settings.jpalTrackingCode
        ? [
            {
              title: t('tracking'),
              description: t('trackingShortDescription', { appName: buildConfig().appName }),
              getSettingValue: (settings: SettingsType) => settings.jpalTrackingEnabled,
              hasBadge: true,
              onPress: () => {
                navigation.navigate(JPAL_TRACKING_ROUTE, {})
              },
            },
          ]
        : []),
    ],
  },
]

export default createSettingsSections
