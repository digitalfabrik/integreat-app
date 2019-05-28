// @flow

import { withTheme } from 'styled-components/native'
import { connect } from 'react-redux'
import compose from 'lodash/fp/compose'

import type { StateType } from '../../../modules/app/StateType'
import withRouteCleaner from '../../../modules/endpoint/hocs/withRouteCleaner'
import { type Dispatch } from 'redux'
import CategoriesRouteStateView from '../../../modules/app/CategoriesRouteStateView'
import type { StoreActionType } from '../../../modules/app/StoreActionType'
import createNavigateToCategory from '../../../modules/app/createNavigateToCategory'
import createNavigateToIntegreatUrl from '../../../modules/app/createNavigateToIntegreatUrl'
import { branch, renderComponent } from 'recompose'
import CategoryLanguageNotAvailableContainer from './CategoryLanguageNotAvailableContainer'
import CategoriesScrollView from '../components/CategoriesScrollView'
import { Failure } from '../../../modules/error/components/Failure'

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>, ownProps) => ({
  navigateToCategory: createNavigateToCategory('Categories', dispatch, ownProps.navigation),
  navigateToIntegreatUrl: createNavigateToIntegreatUrl(dispatch, ownProps.navigation)
})

const mapStateToProps = (state: StateType, ownProps) => {
  const route = state.cityContent.categoriesRouteMapping[ownProps.navigation.getParam('key')]
  if (!route) {
    return {}
  }

  if (state.cities.errorMessage !== undefined || route.errorMessage !== undefined ||
    state.cityContent.resourceCache.errorMessage !== undefined) {
    return {error: true}
  }
  const cities = state.cities.models

  if (!route.allAvailableLanguages.has(route.language || '')) {
    return {invalidLanguage: true}
  }

  const stateView = new CategoriesRouteStateView(route.root, route.models, route.children)

  return {
    cityCode: state.cityContent.city,
    language: route.language,
    cities,
    stateView: stateView,
    resourceCache: state.cityContent.resourceCache
  }
}

export default compose([
  withRouteCleaner,
  connect(mapStateToProps, mapDispatchToProps),
  // TODO NATIVE-112 Show errors
  branch(props => props.error, renderComponent(Failure)),
  branch(props => props.invalidLanguage, renderComponent(CategoryLanguageNotAvailableContainer)),
  withTheme
])(CategoriesScrollView)
