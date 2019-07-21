// @flow

import { connect } from 'react-redux'
import type { NavigationScene, NavigationScreenProp } from 'react-navigation'
import { withNavigation } from 'react-navigation'
import type { TFunction } from 'react-i18next'
import { translate } from 'react-i18next'

import Header from '../components/Header'
import withTheme from '../../theme/hocs/withTheme'
import type { StateType } from '../../app/StateType'
import { type Dispatch } from 'redux'
import type { ClearCityActionType, StoreActionType } from '../../app/StoreActionType'
import { currentCityRouteSelector } from '../../common/selectors/currentCityRouteSelector'

type OwnPropsType = {|
  navigation: NavigationScreenProp<*>,
  scene: NavigationScene,
  scenes: Array<NavigationScene>,
  t: TFunction
|}

type StatePropsType = {|
  routeKey: string,
  goToLanguageChange?: () => void
|}

type DispatchPropsType = {|
  navigateToLanding: () => void
|}

type PropsType = {| ...OwnPropsType, ...StatePropsType, ...DispatchPropsType |}

const mapStateToProps = (state: StateType, ownProps: OwnPropsType): StatePropsType => {
  const routeKey = ownProps.navigation.getParam('key')
  if (state.cityContent && state.cityContent.languages) {
    const languages = state.cityContent.languages
    const route = currentCityRouteSelector(state.cityContent, routeKey)
    const currentLanguage = (route && route.language) || state.contentLanguage
    const availableLanguages = (route && route.status === 'ready' && Array.from(route.allAvailableLanguages.keys())) ||
      languages.map(lng => lng.code)
    const goToLanguageChange = () => {
      ownProps.navigation.navigate({
        routeName: 'ChangeLanguageModal', params: { currentLanguage, languages, availableLanguages }
      })
    }
    return { routeKey, goToLanguageChange }
  }

  return { routeKey }
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
