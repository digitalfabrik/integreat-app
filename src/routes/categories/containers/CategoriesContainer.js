// @flow

import { connect } from 'react-redux'
import type { LanguageResourceCacheStateType, StateType } from '../../../modules/app/StateType'
import { type Dispatch } from 'redux'
import CategoriesRouteStateView from '../../../modules/app/CategoriesRouteStateView'
import type { StoreActionType } from '../../../modules/app/StoreActionType'
import createNavigateToCategory from '../../../modules/app/createNavigateToCategory'
import createNavigateToIntegreatUrl from '../../../modules/app/createNavigateToIntegreatUrl'
import CategoriesScrollView from '../components/CategoriesScrollView'
import type { NavigationScreenProp } from 'react-navigation'
import withError from '../../../modules/error/hocs/withError'
import { CityModel, LanguageModel } from '@integreat-app/integreat-api-client'
import type { NavigateToCategoryParamsType } from '../../../modules/app/createNavigateToCategory'
import type { NavigateToIntegreatUrlParamsType } from '../../../modules/app/createNavigateToIntegreatUrl'
import type { PropsType as CategoriesScrollViewPropsType } from '../components/CategoriesScrollView'
import withTheme from '../../../modules/theme/hocs/withTheme'
import withRouteCleaner from '../../../modules/endpoint/hocs/withRouteCleaner'

type OwnPropsType = {| navigation: NavigationScreenProp<*> |}

type StatePropsType = {|
  error: boolean,
  languageNotAvailable: boolean,
  availableLanguages?: Array<LanguageModel>,
  currentLanguage?: string,
  currentCityCode?: string,
  cityCode?: string,
  cities?: Array<CityModel>,
  language?: string,
  stateView?: CategoriesRouteStateView,
  resourceCache?: LanguageResourceCacheStateType
|}

type DispatchPropsType = {|
  navigateToCategory: NavigateToCategoryParamsType => void,
  navigateToIntegreatUrl: NavigateToIntegreatUrlParamsType => void,
  changeUnavailableLanguage?: (params: {| city: string, newLanguage: string, oldLanguage: string |}) => void
|}

type PropsType = {| ...OwnPropsType, ...StatePropsType, ...DispatchPropsType |}

const mapStateToProps = (state: StateType, ownProps: OwnPropsType): StatePropsType => {
  const contentLanguage = state.contentLanguage
  if (!state.cityContent) {
    return { languageNotAvailable: false, error: false }
  }
  const {resourceCache, categoriesRouteMapping, city} = state.cityContent

  if (state.cities.errorMessage !== undefined ||
    categoriesRouteMapping.errorMessage !== undefined ||
    resourceCache.errorMessage !== undefined) {
    return { error: true, languageNotAvailable: false }
  }

  const cities = state.cities.models
  const route = categoriesRouteMapping[ownProps.navigation.getParam('key')]

  if (!route || !cities) {
    return { languageNotAvailable: false, error: false }
  }

  const languages = Array.from(route.allAvailableLanguages.keys())
  const stateView = new CategoriesRouteStateView(route.root, route.models, route.children)

  if (!languages.includes(route.language)) {
    return {
      languageNotAvailable: true,
      availableLanguages: languages,
      currentLanguage: contentLanguage,
      currentCityCode: city,
      error: false
    }
  }

  return {
    error: false,
    languageNotAvailable: false,
    cityCode: city,
    language: route.language,
    cities,
    stateView,
    resourceCache
  }
}

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>, ownProps: OwnPropsType): DispatchPropsType => ({
  navigateToCategory: createNavigateToCategory('Categories', dispatch, ownProps.navigation),
  navigateToIntegreatUrl: createNavigateToIntegreatUrl(dispatch, ownProps.navigation),
  changeUnavailableLanguage: (params: {| city: string, newLanguage: string, oldLanguage: string |}) => {
    dispatch({
      type: 'SWITCH_CONTENT_LANGUAGE', params
    })
  }
})

export default connect<PropsType, OwnPropsType, _, _, _, _>(mapStateToProps, mapDispatchToProps)(
  withRouteCleaner<PropsType>(
    withTheme(props => props.language)(
      withError<CategoriesScrollViewPropsType>(
        CategoriesScrollView
      ))))
