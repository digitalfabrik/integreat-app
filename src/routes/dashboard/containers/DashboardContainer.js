// @flow

import type { Dispatch } from 'redux'

import { connect } from 'react-redux'
import Dashboard from '../components/Dashboard'
import type { StateType } from '../../../modules/app/StateType'
import withTheme from '../../../modules/theme/hocs/withTheme'
import withRouteCleaner from '../../../modules/endpoint/hocs/withRouteCleaner'
import CategoriesRouteStateView from '../../../modules/app/CategoriesRouteStateView'
import type { StoreActionType, SwitchContentLanguageActionType } from '../../../modules/app/StoreActionType'
import createNavigateToCategory from '../../../modules/app/createNavigateToCategory'
import createNavigateToEvent from '../../../modules/app/createNavigateToEvent'
import compose from 'lodash/fp/compose'
import createNavigateToIntegreatUrl from '../../../modules/app/createNavigateToIntegreatUrl'
import { translate } from 'react-i18next'
import type { NavigationScreenProp } from 'react-navigation'
import withError from '../../../modules/error/hocs/withError'
import withLanguageNotAvailable from '../../../modules/common/hocs/withLanguageNotAvailable'

type OwnPropsType = {|
  navigation: NavigationScreenProp<*>
|}

const mapStateToProps = (state: StateType, ownProps: OwnPropsType) => {
  const {resourceCache, categoriesRouteMapping, languages, language, city} = state.cityContent

  if (!languages || !city) {
    return {}
  }

  if (!languages.map(languageModel => languageModel.code).includes(language)) {
    return {languageNotAvailable: true, languages, city}
  }

  if (state.cities.errorMessage !== undefined ||
    categoriesRouteMapping.errorMessage !== undefined ||
    resourceCache.errorMessage !== undefined) {
    return {error: true}
  }

  const cities = state.cities.models
  const route = categoriesRouteMapping[ownProps.navigation.getParam('key')]

  if (!route || !cities) {
    return {}
  }

  return {
    cityCode: city,
    language: route.language,
    cities,
    stateView: new CategoriesRouteStateView(route.root, route.models, route.children),
    resourceCache: resourceCache
  }
}

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>, ownProps: OwnPropsType) => ({
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

export default compose([
  connect(mapStateToProps, mapDispatchToProps),
  withRouteCleaner,
  withError,
  withLanguageNotAvailable,
  translate('dashboard'),
  withTheme(props => props.language)
])(Dashboard)
