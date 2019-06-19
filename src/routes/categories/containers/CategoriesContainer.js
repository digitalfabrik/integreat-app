// @flow

import { connect } from 'react-redux'
import compose from 'lodash/fp/compose'

import type { LanguageResourceCacheStateType, StateType } from '../../../modules/app/StateType'
import withRouteCleaner from '../../../modules/endpoint/hocs/withRouteCleaner'
import { type Dispatch } from 'redux'
import CategoriesRouteStateView from '../../../modules/app/CategoriesRouteStateView'
import type { StoreActionType } from '../../../modules/app/StoreActionType'
import createNavigateToCategory from '../../../modules/app/createNavigateToCategory'
import createNavigateToIntegreatUrl from '../../../modules/app/createNavigateToIntegreatUrl'
import CategoriesScrollView from '../components/CategoriesScrollView'
import type { NavigationScreenProp } from 'react-navigation'
import withError from '../../../modules/error/hocs/withError'
import withTheme from '../../../modules/theme/hocs/withTheme'
import { CityModel, LanguageModel } from '@integreat-app/integreat-api-client'
import type { NavigateToCategoryParamsType } from '../../../modules/app/createNavigateToCategory'
import type { NavigateToIntegreatUrlParamsType } from '../../../modules/app/createNavigateToIntegreatUrl'

type OwnPropsType = {|
  navigation: NavigationScreenProp<*>
|}

type StatePropsType = {|
  success: true,
  cities: Array<CityModel>,
  cityCode: string,
  language: string,
  stateView: CategoriesRouteStateView,
  resourceCache: LanguageResourceCacheStateType
|}
  | {| languageNotAvailable: true, languages: Array<LanguageModel>, city: string |}
  | {| error: true |} | {| loading: true |}

type DispatchPropsType = {|
  navigateToCategory: NavigateToCategoryParamsType => void,
  navigateToIntegreatUrl: NavigateToIntegreatUrlParamsType => void,
  changeUnavailableLanguage: (city: string, newLanguage: string) => StoreActionType
|}

type PropsType = {| ...OwnPropsType, ...StatePropsType, ...DispatchPropsType |}

const mapStateToProps = (state: StateType, ownProps: OwnPropsType) => {
  const {resourceCache, categoriesRouteMapping, city} = state.cityContent

  if (state.cities.errorMessage !== undefined ||
    categoriesRouteMapping.errorMessage !== undefined ||
    resourceCache.errorMessage !== undefined) {
    return {error: true}
  }

  const cities = state.cities.models
  const route = categoriesRouteMapping[ownProps.navigation.getParam('key')]

  if (!route || !cities || !city) {
    return {loading: true}
  }

  if (!route.allAvailableLanguages.has(route.language)) {
    return {languageNotAvailable: true, languages: route.allAvailableLanguages, city}
  }

  const stateView = new CategoriesRouteStateView(route.root, route.models, route.children)

  return {
    success: true,
    cityCode: city,
    language: route.language,
    cities,
    stateView,
    resourceCache: resourceCache
  }
}

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>, ownProps: OwnPropsType) => ({
  navigateToCategory: createNavigateToCategory('Categories', dispatch, ownProps.navigation),
  navigateToIntegreatUrl: createNavigateToIntegreatUrl(dispatch, ownProps.navigation),
  changeUnavailableLanguage: (city: string, newLanguage: string) => dispatch({
    type: 'SWITCH_CONTENT_LANGUAGE',
    params: {city, newLanguage}
  })
})

export default compose([
  connect<PropsType, OwnPropsType, _, _, _, _>(mapStateToProps, mapDispatchToProps),
  withRouteCleaner,
  withError,
  withTheme(props => props.language)
])(CategoriesScrollView)
