// @flow

import { withTheme } from 'styled-components/native'
import { connect } from 'react-redux'
import compose from 'lodash/fp/compose'

import type { CategoryRouteStateType, StateType } from '../../../modules/app/StateType'
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
    if (route && route.error) {
      return {error: true}
    }

    if (route && !route.allAvailableLanguages.has(state.cityContent.language || '')) {
      return {invalidLanguage: true}
    }

    return mapStateToProps(state, route)
  }, mapDispatchToProps),
  // TODO NATIVE-112 Show errors
  branch(props => props.error, renderComponent(Failure)),
  branch(props => props.invalidLanguage, renderComponent(CategoryLanguageNotAvailableContainer)),
  withTheme
])(CategoriesScrollView)
