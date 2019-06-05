// @flow

import { type TFunction } from 'react-i18next'
import { Linking } from 'react-native'
import type { SettingsType } from './SettingsType'

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
          description: 'Placeholder'
        },
        {
          title: 'Placeholder',
          description: 'Placeholder'
        }
      ]
    },
    {
      data: [
        {
          title: t('troubleshooting'),
          description: t('troubleshootingDescription'),
          hasSwitch: true,
          onPress: () => { setSetting(settings => ({errorTracking: !settings.errorTracking})) }
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
