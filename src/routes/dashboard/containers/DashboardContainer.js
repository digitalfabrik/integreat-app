// @flow

import type { Dispatch } from 'redux'

import { connect } from 'react-redux'
import Dashboard from '../components/Dashboard'
import toggleDarkMode from 'modules/theme/actions/toggleDarkMode'
import { offlineActionTypes } from 'react-native-offline'
import type { StateType } from '../../../modules/app/StateType'
import { CityModel } from '@integreat-app/integreat-api-client'
import { withTheme } from 'styled-components'
import withError from '../../../modules/error/hocs/withError'
import withMemoryDatabase from '../../../modules/endpoint/hocs/withMemoryDatabase'
import MemoryDatabase from '../../../modules/endpoint/MemoryDatabase'
import CategoriesStateView from '../../../modules/categories/CategoriesStateView'
import type { StoreActionType } from '../../../modules/app/StoreActionType'
import navigateToCategory from '../../../modules/categories/navigateToCategory'

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>, ownProps) => ({
  toggleTheme: () => dispatch(toggleDarkMode()),
  goOffline: () => dispatch({
    type: offlineActionTypes.CONNECTION_CHANGE,
    payload: false
  }),
  goOnline: () => dispatch({
    type: offlineActionTypes.CONNECTION_CHANGE,
    payload: true
  }),
  navigateToCategory: navigateToCategory('Categories', dispatch, ownProps.navigation),
  fetchCities: (language: string) => dispatch({
    type: 'FETCH_CITIES_REQUEST',
    params: {language},
    meta: {retry: true}
  }),
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
const themed = withTheme(Dashboard)
// $FlowFixMe connect()
export default withMemoryDatabase(connect(mapStateToProps, mapDispatchToProps)(withError(themed)))
