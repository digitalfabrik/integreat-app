// @flow

import { connect } from 'react-redux'
import { withNavigation } from 'react-navigation'
import { translate } from 'react-i18next'

import Header from '../components/Header'
import withTheme from '../../theme/hocs/withTheme'
import type { StateType } from '../../app/StateType'
import { type Dispatch } from 'redux'
import type { ClearCityActionType, StoreActionType } from '../../app/StoreActionType'
import type { NavigationScene, NavigationScreenProp } from 'react-navigation'
import type { TFunction } from 'react-i18next'
import isPeekingRoute from '../../endpoint/selectors/isPeekingRoute'

type OwnPropsType = {|
  navigation: NavigationScreenProp<*>,
  scene: NavigationScene,
  scenes: Array<NavigationScene>,
  t: TFunction
|}

type StatePropsType = {|
  routeKey: string,
  peeking: boolean
|}

type DispatchPropsType = {|
  navigateToLanding: () => void
|}

type PropsType = {| ...OwnPropsType, ...StatePropsType, ...DispatchPropsType |}

const mapStateToProps = (state: StateType, ownProps: OwnPropsType): StatePropsType => {
  const routeKey = ownProps.navigation.getParam('key')
  const peeking = isPeekingRoute(state, { routeKey })
  return { routeKey, peeking }
}

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>, ownProps: OwnPropsType): DispatchPropsType => ({
  navigateToLanding: () => {
    const clearCity: ClearCityActionType = { type: 'CLEAR_CITY' }
    dispatch(clearCity)
    ownProps.navigation.navigate('Landing')
  }
})

export default withNavigation(
  translate('header')(
    connect<PropsType, OwnPropsType, _, _, _, _>(mapStateToProps, mapDispatchToProps)(
      withTheme(props => props.language)(
        Header
      ))))
