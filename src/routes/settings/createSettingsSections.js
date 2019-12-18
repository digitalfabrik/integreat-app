// @flow

import { type TFunction } from 'react-i18next'
import { Linking } from 'react-native'
import NativeConstants from '../../modules/native-constants/NativeConstants'
import type { SettingsType } from '../../modules/settings/AppSettings'
import openPrivacyPolicy from './openPrivacyPolicy'

export type ChangeSettingFunctionType = SettingsType => $Shape<SettingsType>

export default ({ setSetting, t, language }: {
                  setSetting: (changeSetting: ChangeSettingFunctionType) => Promise<void>,
                  t: TFunction,
                  language: string
                }
) => {
  return ([
    {
      title: null,
      data: [
        {
          title: t('pushNewsTitle'),
          description: t('pushNewsDescription'),
          hasSwitch: true,
          getSettingValue: (settings: SettingsType) => settings.allowPushNotifications,
          onPress: () => { setSetting(settings => ({ allowPushNotifications: !settings.allowPushNotifications })) }
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
          description: t('sentryDescription'),
          hasSwitch: true,
          getSettingValue: (settings: SettingsType) => settings.errorTracking,
          onPress: () => { setSetting(settings => ({ errorTracking: !settings.errorTracking })) }
        },
        {
          title: t('about'),
          onPress: () => {
            if (language === 'de') {
              Linking.openURL('https://integreat-app.de/about/')
            } else {
              Linking.openURL('https://integreat-app.de/en/about/')
            }
          }
        },
        {
          title: t('privacyPolicy'),
          onPress: () => openPrivacyPolicy(language)
        },
        {
          title: t('version', { version: NativeConstants.appVersion })
        }
      ]
    }
  ])
}
