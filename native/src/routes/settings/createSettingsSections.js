// @flow

import { type TFunction } from 'react-i18next'
import { Linking } from 'react-native'
import NativeConstants from '../../modules/native-constants/NativeConstants'
import type { SettingsType } from '../../modules/settings/AppSettings'
import openPrivacyPolicy from './openPrivacyPolicy'
import buildConfig from '../../modules/app/constants/buildConfig'
import * as Sentry from '@sentry/react-native'
import * as NotificationsManager from '../../modules/push-notifications/PushNotificationsManager'
import initSentry from '../../modules/app/initSentry'

export type SetSettingFunctionType = (
  changeSetting: (settings: SettingsType) => $Shape<SettingsType>,
  changeAction?: (newSettings: SettingsType) => Promise<void>
) => Promise<void>

const volatileValues = {
  versionTaps: 0
}

const TRIGGER_VERSION_TAPS = 25

type CreateSettingsSectionsPropsType = {|
  setSetting: SetSettingFunctionType,
  t: TFunction,
  languageCode: string,
  cityCode: ?string
|}

const createSettingsSections = ({ setSetting, t, languageCode, cityCode }: CreateSettingsSectionsPropsType) => (
  [
    {
      title: null,
      data: [
        {
          title: t('pushNewsTitle'),
          description: t('pushNewsDescription'),
          hasSwitch: true,
          getSettingValue: (settings: SettingsType) => settings.allowPushNotifications,
          onPress: () => {
            setSetting(
              settings => ({ allowPushNotifications: !settings.allowPushNotifications }),
              async newSettings => {
                if (!cityCode) {
                  // No city selected so nothing to do here
                  return
                }
                if (newSettings.allowPushNotifications) {
                  await NotificationsManager.subscribeNews(cityCode, languageCode, buildConfig().featureFlags)
                } else {
                  await NotificationsManager.unsubscribeNews(cityCode, languageCode, buildConfig().featureFlags)
                }
              }
            )
          }
        },
        {
          title: t('proposeCitiesTitle'),
          description: t('proposeCitiesDescription'),
          hasSwitch: true,
          getSettingValue: (settings: SettingsType) => settings.proposeNearbyCities,
          onPress: () => { setSetting(settings => ({ proposeNearbyCities: !settings.proposeNearbyCities })) }
        },
        {
          title: t('sentryTitle'),
          description: t('sentryDescription', { appName: buildConfig().appName }),
          hasSwitch: true,
          getSettingValue: (settings: SettingsType) => settings.errorTracking,
          onPress: () => {
            setSetting(
              settings => ({ errorTracking: !settings.errorTracking }),
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
          title: t('about', { appName: buildConfig().appName }),
          onPress: () => {
            const aboutUrl = buildConfig().aboutUrls[languageCode] || buildConfig().aboutUrls.default
            Linking.openURL(aboutUrl)
          }
        },
        {
          accessibilityRole: 'link',
          title: t('privacyPolicy'),
          onPress: () => openPrivacyPolicy(languageCode)
        },
        {
          accessibilityRole: 'none',
          title: t('version', { version: NativeConstants.appVersion }),
          onPress: () => {
            volatileValues.versionTaps++
            if (volatileValues.versionTaps === TRIGGER_VERSION_TAPS) {
              volatileValues.versionTaps = 0
              throw Error('This error was thrown for testing purposes. Please ignore this error.')
            }
          }
        }
      ]
    }
  ]
)

export default createSettingsSections
