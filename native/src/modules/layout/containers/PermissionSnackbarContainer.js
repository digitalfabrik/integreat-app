// @flow

import * as React from 'react'
import Snackbar from '../components/Snackbar'
import type { ThemeType } from '../../theme/constants'
import { type TFunction, withTranslation } from 'react-i18next'
import withTheme from '../../theme/hocs/withTheme'
import AppSettings from '../../settings/AppSettings'
import { openSettings, RESULTS } from 'react-native-permissions'
import { checkLocationPermission, requestLocationPermission } from '../../app/LocationPermissionManager'
import SnackbarAnimator from '../components/SnackbarAnimator'
import buildConfig from '../../app/constants/buildConfig'
import {
  checkPushNotificationPermission,
  requestPushNotificationPermission
} from '../../push-notifications/PushNotificationsManager'
import type { FeatureFlagsType } from 'build-configs/BuildConfigType'
import { DASHBOARD_ROUTE, LANDING_ROUTE } from '../../app/components/NavigationTypes'

type PropsType = {|
  routeName: string,
  t: TFunction,
  theme: ThemeType
|}

type StateType = {|
  showLocationSnackbar: boolean,
  showPushNotificationSnackbar: boolean
|}

class PermissionSnackbarContainer extends React.Component<PropsType, StateType> {
  constructor (props: PropsType) {
    super(props)
    this.state = {
      showLocationSnackbar: false,
      showPushNotificationSnackbar: false
    }
  }

  componentDidMount () {
    this.updateSettingsAndPermissions()
  }

  componentDidUpdate (prevProps: PropsType) {
    if (prevProps.routeName !== this.props.routeName) {
      this.updateSettingsAndPermissions()
    }
  }

  updateSettingsAndPermissions = async () => {
    const settings = await new AppSettings().loadSettings()
    const locationStatus = await checkLocationPermission()
    const pushNotificationStatus = await checkPushNotificationPermission()

    const showLocationSnackbar = settings && settings.proposeNearbyCities === true &&
      [RESULTS.BLOCKED, RESULTS.DENIED].includes(locationStatus) && this.landingRoute()

    const showPushNotificationSnackbar = settings && settings.allowPushNotifications === true &&
      [RESULTS.BLOCKED, RESULTS.DENIED].includes(pushNotificationStatus) && this.dashboardRoute()

    this.setState({
      showLocationSnackbar,
      showPushNotificationSnackbar
    })
  }

  deactivateProposeNearbyCities = async () => {
    await new AppSettings().setSettings({ proposeNearbyCities: false })
    this.updateSettingsAndPermissions()
  }

  deactivateAllowPushNotifications = async () => {
    await new AppSettings().setSettings({ allowPushNotifications: false })
    this.updateSettingsAndPermissions()
  }

  requestOrOpenSettings = async (status: () => Promise<RESULTS>, request: FeatureFlagsType => Promise<void>) => {
    const permissionStatus = await status()
    if (permissionStatus === RESULTS.BLOCKED) {
      await openSettings()
    } else {
      await request(buildConfig().featureFlags)
    }
    this.updateSettingsAndPermissions()
  }

  requestLocationPermissionOrSettings = async () => {
    this.requestOrOpenSettings(checkLocationPermission, requestLocationPermission)
  }

  requestPushNotificationPermissionOrSettings = async () => {
    this.requestOrOpenSettings(checkPushNotificationPermission, requestPushNotificationPermission)
  }

  landingRoute = (): boolean => {
    const { routeName } = this.props
    return routeName === LANDING_ROUTE
  }

  dashboardRoute = (): boolean => {
    const { routeName } = this.props
    return routeName === DASHBOARD_ROUTE
  }

  getSnackbar (): ?React$Element<*> {
    const { t, theme } = this.props
    const { showLocationSnackbar, showPushNotificationSnackbar } = this.state
    if (showLocationSnackbar) {
      return <Snackbar key='location'
                       positiveAction={{
                         label: t('grantPermission').toUpperCase(),
                         onPress: this.requestLocationPermissionOrSettings
                       }}
                       negativeAction={{
                         label: t('deactivate').toUpperCase(),
                         onPress: this.deactivateProposeNearbyCities
                       }}
                       message={t('locationPermissionMissing')} theme={theme} />
    } else if (showPushNotificationSnackbar) {
      return <Snackbar key='push'
                       positiveAction={{
                         label: t('grantPermission').toUpperCase(),
                         onPress: this.requestPushNotificationPermissionOrSettings
                       }}
                       negativeAction={{
                         label: t('deactivate').toUpperCase(),
                         onPress: this.deactivateAllowPushNotifications
                       }}
                       message={t('pushNotificationPermissionMissing')} theme={theme} />
    }
    return null
  }

  render () {
    return <SnackbarAnimator>
      {this.getSnackbar()}
    </SnackbarAnimator>
  }
}

export default withTranslation('snackbar')(
  withTheme(PermissionSnackbarContainer)
)
