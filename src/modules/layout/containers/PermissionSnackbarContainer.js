// @flow

import * as React from 'react'
import Snackbar, { ANIMATION_DURATION, SNACKBAR_HEIGHT } from '../components/Snackbar'
import type { ThemeType } from '../../theme/constants/theme'
import { type NavigationScreenProp } from 'react-navigation'
import { type TFunction, translate } from 'react-i18next'
import withTheme from '../../theme/hocs/withTheme'
import { connect } from 'react-redux'
import type { CategoryRouteStateType, StateType } from '../../app/StateType'
import type { SettingsType } from '../../settings/AppSettings'
import AppSettings from '../../settings/AppSettings'
import { Animated, Platform } from 'react-native'
import { request, openSettings, check, PERMISSIONS, RESULTS } from 'react-native-permissions'

type OwnPropsType = {|
  navigation: NavigationScreenProp<*>,
  t: TFunction,
  theme: ThemeType,
  dispatch: () => void
|}

type StatePropsType = {|
  landingReady: boolean,
  dashboardReady: boolean
|}

type PropsType = {|
  ...OwnPropsType,
  ...StatePropsType
|}

type ComponentStateType = {|
  settings: SettingsType | null,
  locationPermissionStatus: RESULTS | null,
  pushNotificationPermissionStatus: RESULTS | null,
  show: 'LOCATION' | 'PUSH_NOTIFICATION' | null,
  lastShown: 'LOCATION' | 'PUSH_NOTIFICATION'
|}

class PermissionSnackbarContainer extends React.Component<PropsType, ComponentStateType> {
  _animatedValue: Animated.Value

  constructor (props: PropsType) {
    super(props)
    this.state = {
      settings: null,
      locationPermissionStatus: null,
      pushNotificationPermissionStatus: null,
      show: null,
      lastShown: 'LOCATION'
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
    Animated.timing(this._animatedValue, { toValue: 0, duration: ANIMATION_DURATION }).start()
  }

  hide = () => {
    Animated.timing(this._animatedValue, { toValue: SNACKBAR_HEIGHT, duration: ANIMATION_DURATION }).start()
  }

  updateSettingsAndPermissions = async () => {
    await this.loadSettings()
    await this.loadPermissionStatus()
    this.checkShowSnackbar()
  }

  loadSettings = async () => {
    this.setState({ settings: null })
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
    this.setState({ locationPermissionStatus: null })
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

  checkShowSnackbar = () => {
    const { settings, locationPermissionStatus, pushNotificationPermissionStatus, show: prevShow } = this.state
    const { landingReady, dashboardReady } = this.props

    const showLocationSnackbar = settings !== null && settings.proposeNearbyCities === true &&
      [RESULTS.BLOCKED, RESULTS.DENIED].includes(locationPermissionStatus) &&
      landingReady && this.landingRoute()

    const showPushNotificationSnackbar = settings !== null && settings.allowPushNotifications === true &&
      [RESULTS.BLOCKED, RESULTS.DENIED].includes(pushNotificationPermissionStatus) &&
      dashboardReady && this.dashboardRoute()

    const show = showLocationSnackbar ? 'LOCATION' : showPushNotificationSnackbar ? 'PUSH_NOTIFICATION' : null

    if (show !== prevShow) {
      this.setState({ show })

      if (show === null) {
        this.hide()
      } else {
        this.setState({ lastShown: show })
      }

      if (prevShow === null) {
        this.show()
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
    const { lastShown } = this.state

    if (lastShown === 'LOCATION') {
      return <Snackbar positiveAction={{ label: t('grant'), onPress: this.requestLocationPermissions }}
                       negativeAction={{ label: t('deactivate'), onPress: this.deactivateProposeNearbyCities }}
                       message={t('locationPermissionMissing')} theme={theme} animatedValue={this._animatedValue} />
    } else {
      return <Snackbar positiveAction={{ label: t('grant'), onPress: this.requestPushNotificationPermissions }}
                       negativeAction={{ label: t('deactivate'), onPress: this.deactivateAllowPushNotifications }}
                       message={t('pushNotificationPermissionMissing')} theme={theme}
                       animatedValue={this._animatedValue} />
    }
  }
}

const mapStateToProps = (state: StateType): StatePropsType => {
  const { cities, cityContent } = state
  const landingReady = cities.status === 'ready'
  // $FlowFixMe https://github.com/facebook/flow/issues/2221
  const categoriesMappingValues: Array<CategoryRouteStateType> = cityContent
    ? Object.values(cityContent.categoriesRouteMapping)
    : []
  const dashboardReady = categoriesMappingValues.length >= 1 && categoriesMappingValues[0].status === 'ready'

  return {
    landingReady,
    dashboardReady
  }
}

export default connect<PropsType, OwnPropsType, *, *, *, *>(mapStateToProps)(
  translate('snackbar')(
    withTheme()(
      PermissionSnackbarContainer
    )
  )
)
