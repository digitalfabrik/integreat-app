// @flow

import * as React from 'react'
import Snackbar from '../components/Snackbar'
import type { ThemeType } from '../../theme/constants/theme'
import { type NavigationScreenProp } from 'react-navigation'
import { type TFunction, translate } from 'react-i18next'
import withTheme from '../../theme/hocs/withTheme'
import AppSettings from '../../settings/AppSettings'
import { Platform } from 'react-native'
import { check, openSettings, PERMISSIONS, request, RESULTS } from 'react-native-permissions'
import SnackbarAnimator from '../components/SnackbarAnimator'

type PropsType = {|
  navigation: NavigationScreenProp<*>,
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
    this.state = { showLocationSnackbar: false, showPushNotificationSnackbar: false }
  }

  componentDidMount () {
    this.updateSettingsAndPermissions()
  }

  componentDidUpdate (prevProps: PropsType) {
    if (prevProps.navigation.state !== this.props.navigation.state) {
      this.updateSettingsAndPermissions()
    }
  }

  updateSettingsAndPermissions = async () => {
    const settings = await new AppSettings().loadSettings()
    const locationPermissionStatus = await this.locationPermissionStatus()
    const pushNotificationPermissionStatus = await this.pushNotificationPermissionStatus()

    const showLocationSnackbar = settings && settings.proposeNearbyCities === true &&
      [RESULTS.BLOCKED, RESULTS.DENIED].includes(locationPermissionStatus) && this.landingRoute()

    const showPushNotificationSnackbar = settings && settings.allowPushNotifications === true &&
      [RESULTS.BLOCKED, RESULTS.DENIED].includes(pushNotificationPermissionStatus) && this.dashboardRoute()

    this.setState({ showLocationSnackbar, showPushNotificationSnackbar })
  }

  deactivateProposeNearbyCities = async () => {
    await new AppSettings().setSettings({ proposeNearbyCities: false })
    this.updateSettingsAndPermissions()
  }

  deactivateAllowPushNotifications = async () => {
    await new AppSettings().setSettings({ allowPushNotifications: false })
    this.updateSettingsAndPermissions()
  }

  locationPermissionStatus = async (): RESULTS => {
    if (Platform.OS === 'ios') {
      return check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
    } else {
      return check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
    }
  }

  pushNotificationPermissionStatus = async (): RESULTS => {
    // TODO NATIVE-399 Really check for push notification permissions
    return RESULTS.DENIED
  }

  requestLocationPermissions = async () => {
    if (await this.locationPermissionStatus() === RESULTS.BLOCKED) {
      await openSettings()
    } else {
      await request(Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
    }
    this.updateSettingsAndPermissions()
  }

  requestPushNotificationPermissions = async () => {
    // TODO NATIVE-399 Really request push notification permissions
  }

  landingRoute = (): boolean => {
    const { navigation } = this.props
    const { index, routes } = navigation.state
    const currentRoute = routes[index]

    return currentRoute.key === 'Landing'
  }

  dashboardRoute = (): boolean => {
    const { navigation } = this.props
    const { index, routes } = navigation.state
    const currentRoute = routes[index]

    return currentRoute.key === 'CityContent' && currentRoute.routes[currentRoute.index]?.routeName === 'Dashboard'
  }

  getSnackbar (): ?React$Element<*> {
    const { t, theme } = this.props
    const { showLocationSnackbar, showPushNotificationSnackbar } = this.state
    if (showLocationSnackbar) {
      return <Snackbar key='location' positiveAction={{ label: t('grant'), onPress: this.requestLocationPermissions }}
                       negativeAction={{ label: t('deactivate'), onPress: this.deactivateProposeNearbyCities }}
                       message={t('locationPermissionMissing')} theme={theme} />
    } else if (showPushNotificationSnackbar) {
      return <Snackbar key='push'
                       positiveAction={{ label: t('grant'), onPress: this.requestPushNotificationPermissions }}
                       negativeAction={{ label: t('deactivate'), onPress: this.deactivateAllowPushNotifications }}
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

export default translate('snackbar')(
  withTheme()(
    PermissionSnackbarContainer
  )
)
