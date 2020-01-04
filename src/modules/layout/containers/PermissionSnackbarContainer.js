// @flow

import * as React from 'react'
import Snackbar from '../components/Snackbar'
import type { ThemeType } from '../../theme/constants/theme'
import { type NavigationScreenProp } from 'react-navigation'
import { type TFunction, translate } from 'react-i18next'
import withTheme from '../../theme/hocs/withTheme'
import { connect } from 'react-redux'
import type { CategoryRouteStateType, StateType } from '../../app/StateType'
import type { SettingsType } from '../../settings/AppSettings'
import AppSettings from '../../settings/AppSettings'
import { Platform } from 'react-native'
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
  constructor (props: PropsType) {
    super(props)
    this.state = { settings: null, locationPermissionStatus: null }
  }

  componentDidMount () {
    this.updateSettingsAndPermissions()
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

  renderLocationSnackbar = (): React.Node => {
    const { theme, t } = this.props
    return <Snackbar positiveAction={{ label: t('grant'), onPress: this.requestLocationPermissions }}
                     negativeAction={{ label: t('deactivate'), onPress: this.deactivateProposeNearbyCities }}
                     message={t('locationPermissionMissing')} theme={theme} />
  }

  shouldShowLocationSnackbar = (): boolean => {
    const { settings, locationPermissionStatus } = this.state
    const { navigation, landingReady } = this.props
    const { index, routes } = navigation.state

    if (!settings || !settings.proposeNearbyCities ||
      !locationPermissionStatus || locationPermissionStatus === RESULTS.GRANTED) {
      return false
    }

    const currentRoute = routes[index]
    return currentRoute.key === 'Landing' && landingReady
  }

  shouldShowPushNotificationsSnackbar = (): boolean => {
    const { navigation, dashboardReady } = this.props
    const { index, routes } = navigation.state
    const currentRoute = routes[index]

    const dashboardRouteAndReady = currentRoute.key === 'CityContent' &&
      currentRoute.routes[currentRoute.index]?.routeName === 'Dashboard' &&
      dashboardReady

    // TODO NATIVE-399 Add real check for push notifications permissions
    const pushNotificationPermissionMissing = false

    return dashboardRouteAndReady && pushNotificationPermissionMissing
  }

  render () {
    console.log(this.props.navigation)

    if (this.shouldShowLocationSnackbar()) {
      return this.renderLocationSnackbar()
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
