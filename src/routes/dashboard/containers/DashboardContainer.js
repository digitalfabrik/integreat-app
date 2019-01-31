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
import CategoriesSelectionStateView from '../../../modules/app/CategoriesSelectionStateView'
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
    type: 'FETCH_CITIES',
    params: {}
  }),
  navigateAway: () => dispatch({type: 'CLEAR_CATEGORY', params: {key: ownProps.navigation.getParam('key')}})
})

const mapStateToProps = (state: StateType, ownProps) => {
  const language = state.language

  const database: MemoryDatabase = ownProps.database
  const targetCityCode: CityModel = ownProps.navigation.getParam('cityCode')
  const key: string = ownProps.navigation.getParam('key')
  const targetPath: string = state.categoriesSelection.routeMapping[key]

  if (!targetPath) {
    return {
      cityCode: targetCityCode,
      language: language,
      cities: state.citiesSelection.models
    }
  }

  const models = state.categoriesSelection.models
  const children = state.categoriesSelection.children
  const stateView = new CategoriesSelectionStateView(targetPath, models, children)

  if (!stateView.root()) {
    return {
      cityCode: targetCityCode,
      language: language,
      cities: state.citiesSelection.models
    }
  }

  return {
    cityCode: targetCityCode,
    language: language,
    cities: state.citiesSelection.models,
    categoriesStateView: stateView,
    files: database.resourceCache,
    error: null // fixme display errors
  }
}

// $FlowFixMe
const themed = withTheme(Dashboard)
// $FlowFixMe connect()
export default withMemoryDatabase(connect(mapStateToProps, mapDispatchToProps)(withError(themed)))
