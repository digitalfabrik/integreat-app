// @flow

import React from 'react'
import type { ThemeType } from '../../modules/theme/constants'
import type TFunction from 'react-i18next'
import SettingItem from '../settings/components/SettingItem'
import { Switch } from 'react-native'
import buildConfig from '../../modules/app/constants/buildConfig'

type PropsType = {|
  theme: ThemeType,
  t: TFunction,
  allowPushNotifications: boolean,
  toggleSetAllowPushNotifications: () => void,
  proposeNearbyCities: boolean,
  toggleProposeNearbyCities: () => void,
  errorTracking: boolean,
  toggleErrorTracking: () => void
|}

class CustomizableIntroSettings extends React.Component<PropsType> {
  render () {
    const {
      t, theme, allowPushNotifications,
      toggleSetAllowPushNotifications, proposeNearbyCities,
      toggleProposeNearbyCities, errorTracking, toggleErrorTracking
    } = this.props
    const themeColor = theme.colors.themeColor

    return <>
      <SettingItem bigTitle title={t('settings:pushNewsTitle')} description={t('settings:pushNewsDescription')}
                   onPress={toggleSetAllowPushNotifications} theme={theme}>
        <Switch thumbColor={themeColor} trackColor={{ true: themeColor }} value={allowPushNotifications}
                onValueChange={toggleSetAllowPushNotifications} />
      </SettingItem>
      <SettingItem bigTitle title={t('settings:proposeCitiesTitle')}
                   description={t('settings:proposeCitiesDescription')}
                   onPress={toggleProposeNearbyCities} theme={theme}>
        <Switch thumbColor={themeColor} trackColor={{ true: themeColor }} value={proposeNearbyCities}
                onValueChange={toggleProposeNearbyCities} />
      </SettingItem>
      <SettingItem bigTitle title={t('settings:sentryTitle')}
                   description={t('settings:sentryDescription', { appName: buildConfig().appName })}
                   onPress={toggleErrorTracking} theme={theme}>
        <Switch thumbColor={themeColor} trackColor={{ true: themeColor }} value={errorTracking}
                onValueChange={toggleErrorTracking} />
      </SettingItem>
    </>
  }
}

export default CustomizableIntroSettings
