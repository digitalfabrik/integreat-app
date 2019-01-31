// @flow

import { withTheme } from 'styled-components'
import { translate } from 'react-i18next'

import { connect } from 'react-redux'
import type { StateType } from '../../../modules/app/StateType'
import type { Dispatch } from 'redux'
import type { StoreActionType } from '../../../modules/app/StoreActionType'
import setCurrentCity from '../../../modules/categories/actions/setCurrentCity'
import Landing from '../components/Landing'
import withMemoryDatabase from '../../../modules/endpoint/hocs/withMemoryDatabase'
import navigateToCategory from '../../../modules/categories/navigateToCategory'

const mapStateToProps = (state: StateType) => {
  const cities = state.citiesSelection.models
  return {
    language: state.language,
    cities: cities.length === 0 ? undefined : cities
  }
}

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>, ownProps) => {
  return {
    fetchCities: (language: string) => dispatch({
      type: 'FETCH_CITIES',
      params: {}
    }),
    navigateToCategory: navigateToCategory('Dashboard', dispatch, ownProps.navigation),
    setCurrentCity: (city: string) => dispatch(setCurrentCity(city))
  }
}

// $FlowFixMe
const themed = withTheme(Landing)
export default translate('landing')(withMemoryDatabase(connect(mapStateToProps, mapDispatchToProps)(themed)))
