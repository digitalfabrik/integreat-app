// @flow

import type { Dispatch } from 'redux'

import { connect } from 'react-redux'
import Dashboard from '../components/Dashboard'
import type { CategoryRouteStateType, StateType } from '../../../modules/app/StateType'
import { CityModel } from '@integreat-app/integreat-api-client'
import { withTheme } from 'styled-components/native'
import withError from '../../../modules/error/hocs/withError'
import withRouteCleaner from '../../../modules/endpoint/hocs/withRouteCleaner'
import CategoriesRouteStateView from '../../../modules/app/CategoriesRouteStateView'
import type { StoreActionType } from '../../../modules/app/StoreActionType'
import createNavigateToCategory from '../../../modules/app/createNavigateToCategory'
import createNavigateToEvent from '../../../modules/app/createNavigateToEvent'
import createNavigateToIntegreatUrl from '../../../modules/app/createNavigateToIntegreatUrl'
import { translate } from 'react-i18next'

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>, ownProps) => ({
  refreshDashboard: createNavigateToCategory('Dashboard', dispatch, ownProps.navigation),
  navigateToCategory: createNavigateToCategory('Categories', dispatch, ownProps.navigation),
  navigateToEvent: createNavigateToEvent(dispatch, ownProps.navigation),
  navigateToIntegreatUrl: createNavigateToIntegreatUrl(dispatch, ownProps.navigation),
  fetchCities: () => dispatch({
    type: 'FETCH_CITIES',
    params: {}
  })
})

const mapStateToProps = (state: StateType, ownProps) => {
  const targetCityCode: CityModel = ownProps.navigation.getParam('cityCode')
  const key: string = ownProps.navigation.getParam('key')

  const targetRoute: CategoryRouteStateType = state.cityContent.categoriesRouteMapping[key]
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
const themed = withTheme(Dashboard)
// $FlowFixMe connect()
export default withRouteCleaner(connect(mapStateToProps, mapDispatchToProps)(withError(translate('dashboard')(themed))))
