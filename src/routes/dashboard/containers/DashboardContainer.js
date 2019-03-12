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
import withRouteCleaner from '../../../modules/endpoint/hocs/withRouteCleaner'
import CategoriesSelectionStateView from '../../../modules/app/CategoriesSelectionStateView'
import type { StoreActionType } from '../../../modules/app/StoreActionType'
import navigateToCategory from '../../../modules/app/navigateToCategory'

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
  fetchCities: () => dispatch({
    type: 'FETCH_CITIES',
    params: {}
  })
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

  // const errorMessage = state.cities.error || state.categories.error
  //
  // if (errorMessage) {
  //   throw new Error(`Failed to mapStateToProps: ${errorMessage}`)
  // }

  const models = targetRoute.models
  const children = targetRoute.children
  const stateView = new CategoriesSelectionStateView(targetRoute.root, models, children)

  if (!stateView.hasRoot()) {
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
    resourceCache: state.categories.resourceCache,
    error: null // fixme display errors
  }
}

// $FlowFixMe
const themed = withTheme(Dashboard)
// $FlowFixMe connect()
export default withRouteCleaner(connect(mapStateToProps, mapDispatchToProps)(withError(themed)))
