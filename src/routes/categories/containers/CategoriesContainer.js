// @flow

import Categories from '../../../modules/categories/components/Categories'
import { withTheme } from 'styled-components'

import { connect } from 'react-redux'
import type { StateType } from '../../../modules/app/StateType'
import { ScrollView } from 'react-native'
import React from 'react'
import MemoryDatabase from '../../../modules/endpoint/MemoryDatabase'
import withMemoryDatabase from '../../../modules/endpoint/hocs/withMemoryDatabase'
import { type Dispatch } from 'redux'
import CategoriesStateView from '../../../modules/categories/CategoriesStateView'
import type { StoreActionType } from '../../../modules/app/StoreActionType'
import navigateToCategory from '../../../modules/categories/navigateToCategory'
import { CityModel } from '@integreat-app/integreat-api-client'

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>, ownProps) => ({
  navigateToCategory: navigateToCategory('Categories', dispatch, ownProps.navigation),
  navigateAway: () => dispatch({type: 'NAVIGATE_AWAY', params: {key: ownProps.navigation.getParam('key')}})
})

const mapStateToProps = (state: StateType, ownProps) => {
  const language = state.language

  const database: MemoryDatabase = ownProps.database
  const targetCityCode: CityModel = ownProps.navigation.getParam('cityCode')
  const key: string = ownProps.navigation.getParam('key')

  const targetPath: string = state.categories.routeMapping[key]

  if (!targetPath) {
    return {
      cityCode: targetCityCode,
      language: language,
      cities: state.cities.models
    }
  }

  const errorMessage = state.cities.error || state.categories.error

  if (errorMessage) {
    throw new Error(`Failed to mapStateToProps: ${errorMessage}`)
  }

  const models = state.categories.models
  const children = state.categories.children
  const stateView = new CategoriesStateView(targetPath, models, children)

  if (!stateView.root()) {
    return {
      cityCode: targetCityCode,
      language: language,
      cities: state.cities.models
    }
  }

  return {
    cityCode: targetCityCode,
    language: language,
    cities: state.cities.models,
    categoriesStateView: stateView,
    files: database.resourceCache,
    error: errorMessage
  }
}

// $FlowFixMe
const themed = withTheme(props => <ScrollView><Categories {...props} /></ScrollView>)
// $FlowFixMe connect()
export default withMemoryDatabase(connect(mapStateToProps, mapDispatchToProps)(themed))
