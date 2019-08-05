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
import { CityModel } from '@integreat-app/integreat-api-client'
import isPeekingRoute from '../../endpoint/selectors/isPeekingRoute'

type OwnPropsType = {|
  navigation: NavigationScreenProp<*>,
  scene: NavigationScene,
  scenes: Array<NavigationScene>,
  t: TFunction
|}

type StatePropsType = {|
  language: string,
  goToLanguageChange?: () => void,
  peeking: boolean,
  cityModel?: CityModel
|}

type DispatchPropsType = {|
  navigateToLanding: () => void
|}

type PropsType = {| ...OwnPropsType, ...StatePropsType, ...DispatchPropsType |}

const mapStateToProps = (state: StateType, ownProps: OwnPropsType): StatePropsType => {
  const routeKey = ownProps.navigation.getParam('key')

  const route = state.cityContent?.categoriesRouteMapping[routeKey]
  const languages = state.cityContent?.languages

  if (!route || route.status !== 'ready' || state.cities.errorMessage !== undefined ||
    !state.cities.models || !state.cityContent || !languages) {
    // Route does not exist yet. In this case it is not really defined whether we are peek or not because
    // we do not yet know the city of the route.
    return { language: state.contentLanguage, peeking: false }
  }

  const cities = state.cities.models
  const cityCode = state.cityContent.city
  const cityModel = cities.find(city => city.code === cityCode)
  const goToLanguageChange = () => {
    ownProps.navigation.navigate({
      routeName: 'ChangeLanguageModal',
      params: {
        currentLanguage: route.language,
        languages,
        cityCode,
        availableLanguages: Array.from(route.allAvailableLanguages.keys())
      }
    })
  }
  const peeking = isPeekingRoute(state, { routeCity: route.city })

  return { peeking, cityModel, language: route.language, goToLanguageChange }
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
