// @flow
import { connect } from 'react-redux'
import { withNavigation } from 'react-navigation'
import { translate } from 'react-i18next'

import Header from '../components/Header'
import withTheme from '../../theme/hocs/withTheme'
import type { CategoriesRouteMappingType, StateType } from '../../app/StateType'
import { type Dispatch } from 'redux'
import type { ClearCityActionType, StoreActionType } from '../../app/StoreActionType'
import type { NavigationScene, NavigationScreenProp } from 'react-navigation'
import type { TFunction } from 'react-i18next'

type OwnPropsType = {|
  navigation: NavigationScreenProp<*>,
  scene: NavigationScene,
  scenes: Array<NavigationScene>,
  t: TFunction
|}

type StatePropsType = {|
  routeKey: string,
  routeMapping: CategoriesRouteMappingType
|}

type DispatchPropsType = {|
  navigateToLanding: () => void
|}

type PropsType = {| ...OwnPropsType, ...StatePropsType, ...DispatchPropsType |}

const mapStateToProps = (state: StateType, ownProps: OwnPropsType): StatePropsType => {
  const cityContent = state.cityContent
  const routeKey = ownProps.navigation.getParam('key')
  const routeMapping = cityContent ? cityContent.categoriesRouteMapping : {}
  return { routeKey, routeMapping }
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
