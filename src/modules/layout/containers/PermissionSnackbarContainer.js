// @flow

import * as React from 'react'
import Snackbar from '../components/Snackbar'
import type { ThemeType } from '../../theme/constants/theme'
import { type NavigationScreenProp } from 'react-navigation'
import { translate, type TFunction } from 'react-i18next'
import withTheme from '../../theme/hocs/withTheme'
import { connect } from 'react-redux'
import type { CategoryRouteStateType, StateType } from '../../app/StateType'
import type { SettingsType } from '../../settings/AppSettings'

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
  settings: ?SettingsType
|}

class PermissionSnackbarContainer extends React.Component<PropsType, ComponentStateType> {
  constructor (props: PropsType) {
    super(props)
    this.state = { settings: null }
  }

  componentDidMount () {

  }

  renderLocationSnackbar = (): React.Node => {
    const { theme, t } = this.props
    return <Snackbar message={'asdf'} positiveAction={{ label: 'asdf', onPress: () => {} }} theme={theme} />
  }

  renderPushNotificationSnackbar = (): React.Node => {
    const { theme, t } = this.props
    return <Snackbar message={'asdf'} positiveAction={{ label: 'asdf', onPress: () => {} }} theme={theme} />
  }

  shouldShowLocationSnackbar = (): boolean => {
    const { navigation, landingReady } = this.props
    const { index, routes } = navigation.state
    const currentRoute = routes[index]

    const landingRouteAndReady = currentRoute.key === 'Landing' && landingReady
    const locationPermissionMissing = true

    return locationPermissionMissing && landingRouteAndReady
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
    } else if (this.shouldShowPushNotificationsSnackbar) {
      return this.renderPushNotificationSnackbar()
    }

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
