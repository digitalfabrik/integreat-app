// @flow

import type { Dispatch } from 'redux'

import { connect } from 'react-redux'
import Dashboard from '../components/Dashboard'
import type { StateType } from '../../../modules/app/StateType'
import { withTheme } from 'styled-components/native'
import withRouteCleaner from '../../../modules/endpoint/hocs/withRouteCleaner'
import CategoriesRouteStateView from '../../../modules/app/CategoriesRouteStateView'
import type { StoreActionType } from '../../../modules/app/StoreActionType'
import createNavigateToCategory from '../../../modules/app/createNavigateToCategory'
import createNavigateToEvent from '../../../modules/app/createNavigateToEvent'
import compose from 'lodash/fp/compose'
import { branch, renderComponent } from 'recompose'
import LanguageNotAvailableContainer from '../../../modules/common/containers/LanguageNotAvailableContainer'
import createNavigateToIntegreatUrl from '../../../modules/app/createNavigateToIntegreatUrl'
import { translate } from 'react-i18next'
import { Failure } from '../../../modules/error/components/Failure'

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>, ownProps) => ({
  navigateToDashboard: createNavigateToCategory('Dashboard', dispatch, ownProps.navigation),
  navigateToCategory: createNavigateToCategory('Categories', dispatch, ownProps.navigation),
  navigateToEvent: createNavigateToEvent(dispatch, ownProps.navigation),
  navigateToIntegreatUrl: createNavigateToIntegreatUrl(dispatch, ownProps.navigation)
})

const mapStateToProps = (state: StateType, ownProps) => {
  const route = state.cityContent.categoriesRouteMapping[ownProps.navigation.getParam('key')]

  if (state.cities.errorMessage !== undefined || route.errorMessage !== undefined || state.cityContent.resourceCache) {
    return {error: true}
  }
  const cities = state.cities

  if (!route.allAvailableLanguages.has(state.cityContent.language || '')) {
    return {invalidLanguage: true}
  }

  return {
    cityCode: state.cityContent.city,
    language: route.language,
    cities,
    stateView: new CategoriesRouteStateView(route.root, route.models, route.children),
    resourceCache: state.cityContent.resourceCache
  }
}

export default compose([
  withRouteCleaner,
  connect(mapStateToProps, mapDispatchToProps),
  // TODO NATIVE-112 Show errors, maybe use withError and pass more props
  branch(props => props.error, renderComponent(Failure)),
  branch(props => props.invalidLanguage, renderComponent(LanguageNotAvailableContainer)),
  translate('dashboard'),
  withTheme
])(Dashboard)
