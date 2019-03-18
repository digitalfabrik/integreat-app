// @flow

import Categories from '../../../modules/categories/components/Categories'
import { withTheme } from 'styled-components'

import { connect } from 'react-redux'
import type { StateType } from '../../../modules/app/StateType'
import { ScrollView } from 'react-native'
import React from 'react'
import withRouteCleaner from '../../../modules/endpoint/hocs/withRouteCleaner'
import { type Dispatch } from 'redux'
import CategoriesRouteStateView from '../../../modules/app/CategoriesRouteStateView'
import type { StoreActionType } from '../../../modules/app/StoreActionType'
import navigateToCategory from '../../../modules/app/navigateToCategory'
import { CityModel } from '@integreat-app/integreat-api-client'

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>, ownProps) => ({
  navigateToCategory: navigateToCategory('Categories', dispatch, ownProps.navigation)
})

const mapStateToProps = (state: StateType, ownProps) => {
  const targetCityCode: CityModel = ownProps.navigation.getParam('cityCode')
  const key: string = ownProps.navigation.getParam('key')

  const targetRoute = state.categories.routeMapping[key]
  const language = state.categories.currentLanguage

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
    resourceCache: state.categories.resourceCache,
    error: null // fixme display errors
  }
}

// $FlowFixMe
const themed = withTheme(props => <ScrollView><Categories {...props} /></ScrollView>)
// $FlowFixMe connect()
export default withRouteCleaner(connect(mapStateToProps, mapDispatchToProps)(themed))
