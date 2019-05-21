// @flow

import type { Dispatch } from 'redux'

import { connect } from 'react-redux'
import Dashboard from '../components/Dashboard'
import type { CategoryRouteStateType, StateType } from '../../../modules/app/StateType'
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

const mapStateToProps = (state: StateType, route: ?CategoryRouteStateType) => {
  const language = state.cityContent.language

  if (state.cities.error) {
    throw new Error('Error not handled correctly')
  }

  if (!route || !language) {
    return {
      cityCode: state.cityContent.city,
      language: language,
      cities: state.cities.models
    }
  }

  const models = route.models
  const children = route.children
  const stateView = new CategoriesRouteStateView(route.root, models, children)

  return {
    cityCode: state.cityContent.city,
    language: route.language,
    cities: state.cities.models,
    stateView: stateView,
    resourceCache: state.cityContent.resourceCache
  }
}

export default compose([
  withRouteCleaner,
  connect((state: StateType, ownProps) => {
    const route = state.cityContent.categoriesRouteMapping[ownProps.navigation.getParam('key')]
    if (state.cities.error || (route && route.error)) {
      return {error: true}
    }

    if (route && !route.allAvailableLanguages.has(state.cityContent.language || '')) {
      return {invalidLanguage: true}
    }

    return mapStateToProps(state, route)
  }, mapDispatchToProps),
  // TODO NATIVE-112 Show errors, maybe use withError and pass more props
  branch(props => props.error, renderComponent(Failure)),
  branch(props => props.invalidLanguage, renderComponent(LanguageNotAvailableContainer)),
  translate('dashboard'),
  withTheme
])(Dashboard)
