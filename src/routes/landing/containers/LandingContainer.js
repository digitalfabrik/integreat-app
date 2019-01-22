// @flow

import { withTheme } from 'styled-components'
import { translate } from 'react-i18next'

import { connect } from 'react-redux'
import type { StateType } from '../../../modules/app/StateType'
import { CityModel } from '@integreat-app/integreat-api-client'
import type { Dispatch } from 'redux'
import type { StoreActionType } from '../../../modules/app/StoreActionType'
import setCurrentCity from '../../../modules/categories/actions/setCurrentCity'
import Landing from '../components/Landing'
import withMemoryDatabase from '../../../modules/endpoint/hocs/withMemoryDatabase'

const mapStateToProps = (state: StateType, ownProps) => {
  const navigateToDashboard = (cityModel: CityModel) => {
    ownProps.navigation.navigate('Dashboard', {cityModel})
  }

  return {
    language: state.language,
    cities: ownProps.database.cities,
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
export default translate('landing')(withMemoryDatabase(connect(mapStateToProps, mapDispatchToProps)(themed)))
