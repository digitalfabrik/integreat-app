// @flow

import type { Dispatch } from 'redux'

import { connect } from 'react-redux'
import Dashboard from '../components/Dashboard'
import type { LanguageResourceCacheStateType, StateType } from '../../../modules/app/StateType'
import withTheme from '../../../modules/theme/hocs/withTheme'
import withRouteCleaner from '../../../modules/endpoint/hocs/withRouteCleaner'
import CategoriesRouteStateView from '../../../modules/app/CategoriesRouteStateView'
import type { StoreActionType, SwitchContentLanguageActionType } from '../../../modules/app/StoreActionType'
import createNavigateToCategory from '../../../modules/app/createNavigateToCategory'
import createNavigateToEvent from '../../../modules/app/createNavigateToEvent'
import createNavigateToIntegreatUrl from '../../../modules/app/createNavigateToIntegreatUrl'
import { translate } from 'react-i18next'
import type { NavigationScreenProp } from 'react-navigation'
import withError from '../../../modules/error/hocs/withError'
import { CityModel, LanguageModel } from '@integreat-app/integreat-api-client'
import type { NavigateToCategoryParamsType } from '../../../modules/app/createNavigateToCategory'
import type { NavigateToIntegreatUrlParamsType } from '../../../modules/app/createNavigateToIntegreatUrl'
import type { NavigateToEventParamsType } from '../../../modules/app/createNavigateToEvent'
import type { PropsType as DashboardPropsType } from '../components/Dashboard'

type OwnPropsType = {| navigation: NavigationScreenProp<*> |}

type StatePropsType = {|
  error: boolean,
  languageNotAvailable: boolean,
  availableLanguages?: Array<LanguageModel>,
  currentCityCode?: string,
  currentLanguage?: string,
  cityCode?: string,
  cities?: Array<CityModel>,
  language?: string,
  stateView?: CategoriesRouteStateView,
  resourceCache?: LanguageResourceCacheStateType
|}

type DispatchPropsType = {|
  navigateToDashboard: NavigateToCategoryParamsType => void,
  navigateToCategory: NavigateToCategoryParamsType => void,
  navigateToEvent: NavigateToEventParamsType => void,
  navigateToIntegreatUrl: NavigateToIntegreatUrlParamsType => void,
  changeUnavailableLanguage?: (city: string, language: string) => void
|}

type PropsType = {| ...OwnPropsType, ...StatePropsType, ...DispatchPropsType |}

const mapStateToProps = (state: StateType, ownProps: OwnPropsType): StatePropsType => {
  const contentLanguage = state.contentLanguage
  if (!state.cityContent) {
    return { error: false, languageNotAvailable: false }
  }
  const { resourceCache, categoriesRouteMapping, city, languages } = state.cityContent

  if (languages && !languages.map(language => language.code).includes(contentLanguage)) {
    return {
      languageNotAvailable: true,
      availableLanguages: languages,
      currentCityCode: city,
      error: false,
      currentLanguage: contentLanguage
    }
  }

  if (state.cities.errorMessage !== undefined ||
    categoriesRouteMapping.errorMessage !== undefined ||
    resourceCache.errorMessage !== undefined) {
    return { error: true, languageNotAvailable: false }
  }

  const cities = state.cities.models
  const route = categoriesRouteMapping[ownProps.navigation.getParam('key')]

  if (!route || !cities) {
    return { error: false, languageNotAvailable: false }
  }

  const stateView = new CategoriesRouteStateView(route.root, route.models, route.children)

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
  navigateToDashboard: createNavigateToCategory('Dashboard', dispatch, ownProps.navigation),
  navigateToCategory: createNavigateToCategory('Categories', dispatch, ownProps.navigation),
  navigateToEvent: createNavigateToEvent(dispatch, ownProps.navigation),
  navigateToIntegreatUrl: createNavigateToIntegreatUrl(dispatch, ownProps.navigation),
  changeUnavailableLanguage: (city: string, newLanguage: string) => {
    const switchContentLanguage: SwitchContentLanguageActionType = {
      type: 'SWITCH_CONTENT_LANGUAGE',
      params: {
        city,
        newLanguage
      }
    }
    dispatch(switchContentLanguage)
    createNavigateToCategory('Dashboard', dispatch, ownProps.navigation)({
      cityCode: city,
      language: newLanguage,
      path: `/${city}/${newLanguage}`,
      forceUpdate: false,
      key: ownProps.navigation.getParam('key')
    })
  }
})

export default connect<PropsType, OwnPropsType, _, _, _, _>(mapStateToProps, mapDispatchToProps)(
  withRouteCleaner<PropsType>(
    translate('dashboard')(
      withTheme(props => props.language)(
        withError<DashboardPropsType>(
          Dashboard
        )))))
