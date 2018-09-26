// @flow

import { withTheme } from 'styled-components'
import { translate } from 'react-i18next'

import { connect } from 'react-redux'
import type { StateType } from '../../../modules/app/StateType'
import citiesEndpoint from 'modules/endpoint/endpoints/cities'
import type { Dispatch } from 'redux'
import type { StoreActionType } from '../../../modules/app/StoreActionType'
import setCurrentCity from '../../categories/actions/setCurrentCity'
import Landing from '../components/Landing'
import CityModel from '../../../modules/endpoint/models/CityModel'

const mapStateToProps = (state: StateType, ownProps) => {
  const navigateToDashboard = (cityModel: CityModel) => {
    ownProps.navigation.navigate('Dashboard', {cityModel})
  }

  if (!state.cities.json) {
    return {language: state.language, navigateToDashboard}
  }

  return {
    language: state.language,
    cities: citiesEndpoint.mapResponse(state.cities.json),
    navigateToDashboard
  }
}

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>) => {
  return {
    fetchCities: (language: string) => dispatch({
      type: 'FETCH_CITIES_REQUEST',
      params: {language},
      meta: {retry: true}
    }),
    setCurrentCity: (city: string) => dispatch(setCurrentCity(city))
  }
}

// $FlowFixMe
const themed = withTheme(Landing)
export default translate('landing')(connect(mapStateToProps, mapDispatchToProps)(themed))
