// @flow

import { type TFunction } from 'react-i18next'
import { Linking } from 'react-native'
import type { SettingsType } from '../../modules/settings/AppSettings'

export type ChangeSettingFunctionType = SettingsType => $Shape<SettingsType>

export default ({setSetting, t, language}: {
                  setSetting: (changeSetting: ChangeSettingFunctionType) => Promise<void>,
                  t: TFunction,
                  language: string
                }
) => {
  return ([
    {
      title: 'Placeholder',
      data: [
        {
          title: 'Placeholder',
          description: 'Placeholder',
          hasSwitch: true
        },
        {
          title: 'Placeholder',
          description: 'Placeholder',
          hasSwitch: true
        }
      ]
    },
    {
      title: null,
      data: [
        {
          title: t('troubleshooting'),
          description: t('troubleshootingDescription'),
          hasSwitch: true,
          getSettingValue: (settings: SettingsType) => settings.errorTracking,
          onPress: () => { setSetting(settings => ({errorTracking: !settings.errorTracking})) }
        },
        {
          title: t('allowPushNotifications'),
          description: t('allowPushNotificationsDescription'),
          hasSwitch: true,
          getSettingValue: (settings: SettingsType) => settings.allowPushNotifications,
          onPress: () => { setSetting(settings => ({allowPushNotifications: !settings.allowPushNotifications})) }
        },
        {
          title: t('about'),
          onPress: () => {
            if (language === 'de') {
              Linking.openURL('https://integreat-app.de/')
            } else {
              Linking.openURL('https://integreat-app.de/en/')
            }
          }
        },
        {
          title: t('privacyPolicy'),
          onPress: () => {
            if (language === 'de') {
              Linking.openURL('https://integreat-app.de/datenschutz-webseite/')
            } else {
              Linking.openURL('https://integreat-app.de/en/privacy-website/')
            }
          }
        },
        {
          title: t('version', {version: '??'})
        },
        {
          title: t('openSourceLicenses'),
          onPress: () => { console.warn('Not yet implemented.') }
        }
      ]
    }
  ])
}
