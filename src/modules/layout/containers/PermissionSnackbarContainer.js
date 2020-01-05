// @flow

import * as React from 'react'
import Snackbar, { ANIMATION_DURATION, SNACKBAR_HEIGHT } from '../components/Snackbar'
import type { ThemeType } from '../../theme/constants/theme'
import { type NavigationScreenProp } from 'react-navigation'
import { type TFunction, translate } from 'react-i18next'
import withTheme from '../../theme/hocs/withTheme'
import type { SettingsType } from '../../settings/AppSettings'
import AppSettings from '../../settings/AppSettings'
import { Animated, Platform, Easing } from 'react-native'
import { request, openSettings, check, PERMISSIONS, RESULTS } from 'react-native-permissions'

type PropsType = {|
  navigation: NavigationScreenProp<*>,
  t: TFunction,
  theme: ThemeType,
  dispatch: () => void
|}

type SnackbarType = 'LOCATION' | 'PUSH_NOTIFICATION'

type StateType = {|
  settings: SettingsType | null,
  locationPermissionStatus: RESULTS | null,
  pushNotificationPermissionStatus: RESULTS | null,
  showSnackbar: SnackbarType | null
|}

class PermissionSnackbarContainer extends React.Component<PropsType, StateType> {
  _animatedValue: Animated.Value

  constructor (props: PropsType) {
    super(props)
    this.state = {
      settings: null,
      locationPermissionStatus: null,
      pushNotificationPermissionStatus: null,
      showSnackbar: null
    }
    this._animatedValue = new Animated.Value(SNACKBAR_HEIGHT)
  }

  componentDidMount () {
    this.updateSettingsAndPermissions()
  }

  componentDidUpdate (prevProps: PropsType) {
    if (prevProps.navigation.state !== this.props.navigation.state) {
      this.updateSettingsAndPermissions()
    }
  }

  show = () => {
    Animated.timing(this._animatedValue, { toValue: 0, duration: ANIMATION_DURATION, easing: Easing.linear }).start()
  }

  hide = () => {
    Animated.timing(
      this._animatedValue, { toValue: SNACKBAR_HEIGHT, duration: ANIMATION_DURATION, easing: Easing.linear }
    ).start(() => this.setState({ showSnackbar: null }))
  }

  hideAndShow = (newShow: SnackbarType) => {
    Animated.timing(
      this._animatedValue, { toValue: SNACKBAR_HEIGHT, duration: ANIMATION_DURATION, easing: Easing.linear }
    ).start(() => {
      this.setState({ showSnackbar: newShow })
    })

    Animated.sequence([
      Animated.delay(2 * ANIMATION_DURATION),
      Animated.timing(this._animatedValue, { toValue: 0, duration: ANIMATION_DURATION, easing: Easing.linear })
    ]).start()
  }

  updateSettingsAndPermissions = async () => {
    await this.loadSettings()
    await this.loadPermissionStatus()
    await this.checkShowSnackbar()
  }

  loadSettings = async () => {
    const appSettings = new AppSettings()
    const settings = await appSettings.loadSettings()
    this.setState({ settings })
  }

  deactivateProposeNearbyCities = async () => {
    const appSettings = new AppSettings()
    await appSettings.setSettings({ proposeNearbyCities: false })
    this.hide()
  }

  deactivateAllowPushNotifications = async () => {
    const appSettings = new AppSettings()
    await appSettings.setSettings({ allowPushNotifications: false })
    this.hide()
  }

  loadPermissionStatus = async () => {
    const locationPermissionStatus = await this.locationPermissionStatus()
    const pushNotificationPermissionStatus = await this.pushNotificationPermissionStatus()
    this.setState({ locationPermissionStatus, pushNotificationPermissionStatus })
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
    const { locationPermissionStatus } = this.state
    if (locationPermissionStatus === RESULTS.BLOCKED) {
      await openSettings()
    } else {
      const result = await request(Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)

      if (result === RESULTS.GRANTED) {
        this.hide()
      }
    }
    this.updateSettingsAndPermissions()
  }

  requestPushNotificationPermissions = async () => {
    // TODO NATIVE-399 Really request push notification permissions
  }

  checkShowSnackbar = async () => {
    const { settings, locationPermissionStatus, pushNotificationPermissionStatus, showSnackbar: prevShow } = this.state

    const showLocationSnackbar = settings !== null && settings.proposeNearbyCities === true &&
      [RESULTS.BLOCKED, RESULTS.DENIED].includes(locationPermissionStatus) &&
      this.landingRoute()

    const showPushNotificationSnackbar = settings !== null && settings.allowPushNotifications === true &&
      [RESULTS.BLOCKED, RESULTS.DENIED].includes(pushNotificationPermissionStatus) &&
      this.dashboardRoute()

    const showSnackbar = showLocationSnackbar ? 'LOCATION' : showPushNotificationSnackbar ? 'PUSH_NOTIFICATION' : null

    if (showSnackbar !== prevShow) {
      if (showSnackbar === null) {
        this.hide()
      } else if (prevShow === null) {
        await this.setState({ showSnackbar })
        this.show()
      } else {
        this.hideAndShow(showSnackbar)
      }
    }
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

  render () {
    const { theme, t } = this.props
    const { showSnackbar } = this.state

    if (showSnackbar === 'LOCATION') {
      return <Snackbar positiveAction={{ label: t('grant'), onPress: this.requestLocationPermissions }}
                       negativeAction={{ label: t('deactivate'), onPress: this.deactivateProposeNearbyCities }}
                       message={t('locationPermissionMissing')} theme={theme} animatedValue={this._animatedValue} />
    } else if (showSnackbar === 'PUSH_NOTIFICATION') {
      return <Snackbar positiveAction={{ label: t('grant'), onPress: this.requestPushNotificationPermissions }}
                       negativeAction={{ label: t('deactivate'), onPress: this.deactivateAllowPushNotifications }}
                       message={t('pushNotificationPermissionMissing')} theme={theme}
                       animatedValue={this._animatedValue} />
    }

    return null
  }
}

export default translate('snackbar')(
  withTheme()(
    PermissionSnackbarContainer
  )
)
