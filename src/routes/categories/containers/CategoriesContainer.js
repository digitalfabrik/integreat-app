// @flow

import Categories from '../../../modules/categories/components/Categories'
import { withTheme } from 'styled-components/native'
import compose from 'lodash/fp/compose'

import { connect } from 'react-redux'
import type { CategoriesRouteMappingType, StateType } from '../../../modules/app/StateType'
import { ScrollView } from 'react-native'
import React from 'react'
import withRouteCleaner from '../../../modules/endpoint/hocs/withRouteCleaner'
import { type Dispatch } from 'redux'
import CategoriesRouteStateView from '../../../modules/app/CategoriesRouteStateView'
import type { StoreActionType } from '../../../modules/app/StoreActionType'
import createNavigateToCategory from '../../../modules/app/createNavigateToCategory'
import { CityModel } from '@integreat-app/integreat-api-client'
import { branch, renderComponent } from 'recompose'
import CategoryNotAvailableContainer from './CategoryNotAvailableContainer'

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>, ownProps) => ({
  navigateToCategory: createNavigateToCategory('Categories', dispatch, ownProps.navigation)
})

const mapStateToProps = (state: StateType, ownProps) => {
  const targetCityCode: CityModel = ownProps.navigation.getParam('cityCode')
  const key: string = ownProps.navigation.getParam('key')

  const targetRoute: CategoriesRouteMappingType = state.cityContent.categoriesRouteMapping[key]
  const language = state.cityContent.language

  if (!targetRoute || !language) {
    return {
      cityCode: targetCityCode,
      language: language,
      cities: state.cities.models
    }
  }

  const models = targetRoute.models
  const children = targetRoute.children
  const stateView = new CategoriesRouteStateView(targetRoute.root, models, children)

  return {
    cityCode: targetCityCode,
    language: language,
    cities: state.cities.models,
    stateView: stateView,
    resourceCache: state.cityContent.resourceCache,
    error: null // fixme display errors
  }
}

// $FlowFixMe
const themed = withTheme(props => <ScrollView><Categories {...props} /></ScrollView>)
// $FlowFixMe connect()
export default compose(
  withRouteCleaner,
  connect((state: StateType, ownProps) => ({
    invalidLanguage: !state.cityContent.categoriesRouteMapping[ownProps.navigation.getParam('key')]
      .allAvailableLanguages.has(state.cityContent.language)
  })),
  branch(props => props.invalidLanguage, renderComponent(CategoryNotAvailableContainer)),
  connect(mapStateToProps, mapDispatchToProps)
)(themed)
