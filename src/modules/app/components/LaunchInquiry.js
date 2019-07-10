// @flow

import * as React from 'react'

import type { Store } from 'redux'
import type { StateType } from '../StateType'
import type { StoreActionType } from '../StoreActionType'
import type { DataContainer } from '../../endpoint/DataContainer'
import AppSettings from '../../settings/AppSettings'
import SentryIntegration from '../SentryIntegration'
import { Alert } from 'react-native'
import { translate, type TFunction } from 'react-i18next'
import { Sentry } from 'react-native-sentry'

type PropsType = {|
  t: TFunction,
  children: React.Node
|}

type AppStateType = {|
  waitingForSentry: boolean
|}

class LaunchInquiry extends React.Component<PropsType, AppStateType> {
  store: Store<StateType, StoreActionType>
  dataContainer: DataContainer
  appSettings: AppSettings

  constructor (props: PropsType) {
    super(props)
    this.state = {
      waitingForSentry: true
    }

    this.appSettings = new AppSettings()

    this.askAlerts()
  }

  async askAlerts () {
    const {t} = this.props

    try {
      const settings = await this.appSettings.loadSettings()

      if (settings.errorTracking === null) {
        Alert.alert(
          t('troubleshooting'),
          t('troubleshootingDescription'),
          [
            {text: t('no'), style: 'destructive', onPress: () => this.disableSentry()},
            {text: t('askLater'), style: 'cancel', onPress: () => this.setState({waitingForSentry: false})},
            {text: t('yes'), style: 'default', onPress: () => this.enableSentry(true)}
          ],
          {cancelable: true}
        )
      } else if (settings.errorTracking === true) {
        await this.enableSentry()
      } else {
        this.setState({waitingForSentry: false})
      }

      if (settings.allowPushNotifications === null) {
        Alert.alert(
          t('allowPushNotifications'),
          t('allowPushNotificationsDescription'),
          [
            {text: t('no'), style: 'destructive', onPress: () => this.disablePushNotification()},
            {text: t('askLater'), style: 'cancel'},
            {text: t('yes'), style: 'default', onPress: () => this.enablePushNotification()}
          ],
          {cancelable: true}
        )
      }
    } catch (e) {
      console.error('Failed to load settings.')
      this.setState({waitingForSentry: false})
    }
  }

  async enableSentry (persist: boolean = false) {
    try {
      const sentry = new SentryIntegration()
      await sentry.install()
      if (persist) {
        await this.appSettings.setSettings({errorTracking: true})
      }
    } catch (e) {
      console.error('Failed to enable sentry.')
    } finally {
      this.setState({waitingForSentry: false})
    }
  }

  async disableSentry () {
    this.setState({waitingForSentry: false})
    await this.appSettings.setSettings({errorTracking: false})
  }

  async enablePushNotification () {
    await this.appSettings.setSettings({allowPushNotifications: true})
  }

  async disablePushNotification () {
    await this.appSettings.setSettings({allowPushNotifications: false})
  }

  render () {
    if (this.state.waitingForSentry) {
      return null
    }

    Sentry.captureBreadcrumb({
      message: 'Fist render in LaunchInquiry',
      category: 'component',
      data: {}
    })

    return this.props.children
  }
}

export default translate('launchInquiry')(LaunchInquiry)
