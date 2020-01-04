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
  settings: ?SettingsType,
  locationPermissionStatus: ?RESULTS
|}

class PermissionSnackbarContainer extends React.Component<PropsType, ComponentStateType> {
  _animatedValue: Animated.Value

  constructor (props: PropsType) {
    super(props)
    this.state = { settings: null, locationPermissionStatus: null }
    this._animatedValue = new Animated.Value(SNACKBAR_HEIGHT)
  }

  componentDidMount () {
    this.updateSettingsAndPermissions()
  }

  componentDidUpdate (prevProps: PropsType) {
    if (prevProps.navigation.state !== this.landingRoute() || this.dashboardRoute()) {
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
  }

  loadPermissionStatus = async () => {
    this.setState({ locationPermissionStatus: null })
    const locationPermissionStatus = await this.locationPermissionStatus()
    this.setState({ locationPermissionStatus })
  }

  locationPermissionStatus = async (): RESULTS => {
    if (Platform.OS === 'ios') {
      return check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
    } else {
      return check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
    }
  }

  requestLocationPermissions = async () => {
    const { locationPermissionStatus } = this.state
    if (locationPermissionStatus === RESULTS.BLOCKED) {
      await openSettings()
    } else {
      await request(Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
    }

    await this.loadPermissionStatus()
  }

  shouldShowLocationSnackbar = (): boolean => {
    const { settings, locationPermissionStatus } = this.state
    const { landingReady } = this.props

    if (!settings || !settings.proposeNearbyCities ||
      !locationPermissionStatus || locationPermissionStatus === RESULTS.GRANTED) {
      return false
    }

    return this.landingRoute() && landingReady
  }

  shouldShowPushNotificationsSnackbar = (): boolean => {
    const { settings } = this.state
    const { dashboardReady } = this.props

    // TODO NATIVE-399 Add real check for push notifications permissions
    if (!settings || !settings.proposeNearbyCities) {
      return false
    }
    return this.dashboardRoute() && dashboardReady
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
    console.log(this.props.navigation)

    if (this.shouldShowLocationSnackbar()) {
      return <Snackbar positiveAction={{ label: t('grant'), onPress: this.requestLocationPermissions }}
                       negativeAction={{ label: t('deactivate'), onPress: this.deactivateProposeNearbyCities }}
                       message={t('locationPermissionMissing')} theme={theme} animatedValue={this._animatedValue} />
    } /* else if (this.shouldShowPushNotificationsSnackbar) {
      return this.renderPushNotificationSnackbar()
    } */

    return null
  }
}

const mapStateToProps = (state: StateType): StatePropsType => {
  const { cities, cityContent } = state
  const landingReady = cities.status === 'ready'
  // $FlowFixMe https://github.com/facebook/flow/issues/2221
  const categoriesMappingValues: Array<CategoryRouteStateType> = cityContent
    ? Object.values(cityContent.categoriesRouteMapping)
    : []
  const dashboardReady = categoriesMappingValues.length === 1 && categoriesMappingValues[0].status === 'ready'

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
