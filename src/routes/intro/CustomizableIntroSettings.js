// @flow

import React from 'react'
import type { ThemeType } from '../../modules/theme/constants/theme'
import type TFunction from 'react-i18next'
import SettingItem from '../settings/components/SettingItem'
import { Switch } from 'react-native'

type PropsType = {|
  theme: ThemeType,
  t: TFunction,
  allowPushNotifications: boolean,
  toggleSetAllowPushNotifications: () => void,
  proposeNearbyCities: boolean,
  toggleProposeNearbyCities: () => void,
  allowSentry: boolean,
  toggleAllowSentry: () => void
|}

class CustomizableIntroSettings extends React.Component<PropsType> {
  render () {
    const { t, theme, allowPushNotifications,
      toggleSetAllowPushNotifications, proposeNearbyCities,
      toggleProposeNearbyCities, allowSentry, toggleAllowSentry
    } = this.props
    const themeColor = theme.colors.themeColor

    return <>
      <SettingItem bigTitle title={t('pushNewsTitle')} description={t('pushNewsDescription')}
                   onPress={toggleSetAllowPushNotifications} theme={theme}>
        <Switch thumbColor={themeColor} trackColor={{ true: themeColor }} value={allowPushNotifications} />
      </SettingItem>
      <SettingItem bigTitle title={t('locationTitle')} description={t('locationDescription')}
                   onPress={toggleProposeNearbyCities} theme={theme}>
        <Switch thumbColor={themeColor} trackColor={{ true: themeColor }} value={proposeNearbyCities} />
      </SettingItem>
      <SettingItem bigTitle title={t('sentryTitle')} description={t('sentryDescription')}
                   onPress={toggleAllowSentry} theme={theme}>
        <Switch thumbColor={themeColor} trackColor={{ true: themeColor }} value={allowSentry} />
      </SettingItem>
      </>
  }
}

export default CustomizableIntroSettings
