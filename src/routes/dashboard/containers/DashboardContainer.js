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

const mapDispatchToProps = (dispatch: Dispatch<*>) => ({
  toggleTheme: () => dispatch(toggleDarkMode()),
  goOffline: () => dispatch({
    type: offlineActionTypes.CONNECTION_CHANGE,
    payload: false
  }),
  goOnline: () => dispatch({
    type: offlineActionTypes.CONNECTION_CHANGE,
    payload: true
  }),
  cancelFetchCategories: () => dispatch({
    type: 'FETCH_CATEGORIES_CANCEL'
  }),
  fetchCategories: (language: string, city: string) => dispatch({
    type: 'FETCH_CATEGORIES_REQUEST',
    params: {language, city},
    meta: {retry: true, dismiss: ['FETCH_CATEGORIES_CANCEL']}
  }),
  fetchCities: (language: string) => dispatch({
    type: 'FETCH_CITIES_REQUEST',
    params: {language},
    meta: {retry: true}
  })
})

const mapStateToProps = (state: StateType, ownProps) => {
  const language = state.language

  const database: MemoryDatabase = ownProps.database
  const targetCity: CityModel = ownProps.navigation.getParam('cityModel')
  const targetPath: string = ownProps.navigation.getParam('path') || `/${targetCity.code}/${language}`

  if (!database.hasContext()) {
    const notReadyProps = {
      cityModel: targetCity,
      language: language,
      cities: database.cities
    }

    return notReadyProps
  }

  const navigateToCategories = (path: string) => {
    const params = {path, city: targetCity.code}
    if (ownProps.navigation.push) {
      ownProps.navigation.push('Categories', params)
    }
  }

  const errorMessage = state.cities.error || state.categories.error
  if (errorMessage) {
    console.error(errorMessage)
  }

  return {
    cityModel: targetCity,
    language: language,
    cities: database.cities,
    navigateToCategories,
    path: targetPath,
    categories: database.categoriesMap,
    files: database.resourceCache,
    error: errorMessage
  }
}

// $FlowFixMe
const themed = withTheme(Dashboard)
// $FlowFixMe connect()
export default withMemoryDatabase(connect(mapStateToProps, mapDispatchToProps)(withError(themed)))
