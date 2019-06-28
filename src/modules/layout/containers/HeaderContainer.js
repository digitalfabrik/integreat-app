// @flow
import { connect } from 'react-redux'
import { withNavigation } from 'react-navigation'
import { translate } from 'react-i18next'

import Header from '../components/Header'
import withTheme from '../../theme/hocs/withTheme'
import type { StateType } from '../../app/StateType'
import { availableLanguagesSelector } from '../../common/selectors/availableLanguagesSelector'
import { type Dispatch } from 'redux'
import type { StoreActionType } from '../../app/StoreActionType'
import type { NavigationScene, NavigationScreenProp } from 'react-navigation'
import type { TFunction } from 'react-i18next'

type OwnPropsType = {|
  navigation: NavigationScreenProp<*>,
  scene: NavigationScene,
  scenes: Array<NavigationScene>,
  t: TFunction
|}

type StatePropsType = {|
  availableLanguages: ?Array<string>,
  routeKey: string
|}

type DispatchPropsType = {|
  navigateToLanding: () => void
|}

type PropsType = {| ...OwnPropsType, ...StatePropsType, ...DispatchPropsType |}

const mapStateToProps = (state: StateType, ownProps: OwnPropsType): StatePropsType => {
  const routeKey = ownProps.navigation.getParam('key')
  return {
    availableLanguages: availableLanguagesSelector(state, {routeKey}),
    routeKey
  }
}

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>, ownProps: OwnPropsType): DispatchPropsType => ({
  navigateToLanding: () => {
    dispatch({type: 'CLEAR_CITY_CONTENT'})
    ownProps.navigation.navigate('Landing')
  }
})

export default withNavigation(
  translate('header')(
    connect<PropsType, OwnPropsType, _, _, _, _>(mapStateToProps, mapDispatchToProps)(
      withTheme(props => props.language)(
        Header
      ))))
