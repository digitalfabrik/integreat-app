// @flow

import type { Dispatch } from 'redux'

import { connect } from 'react-redux'
import Dashboard from '../components/Dashboard'
import toggleDarkMode from 'modules/theme/actions/toggleDarkMode'
import { offlineActionTypes } from 'react-native-offline'
import type { StateType } from '../../../modules/app/StateType'
import citiesEndpoint from '../../../modules/endpoint/endpoints/cities'
import CityModel from '../../../modules/endpoint/models/CityModel'

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
  fetchCategories: (prioritisedLanguage: string, city: string) => dispatch({
    type: 'FETCH_CATEGORIES_REQUEST',
    params: {prioritisedLanguage, city},
    meta: {retry: true, dismiss: ['FETCH_CATEGORIES_CANCEL']}
  }),
  fetchCities: (language: string) => dispatch({
    type: 'FETCH_CITIES_REQUEST',
    params: {language},
    meta: {retry: true}
  })
})

const mapStateToProps = (state: StateType, ownProps) => {
  const targetCity: CityModel = ownProps.navigation.getParam('cityModel')

  const language = state.language
  const cities = state.cities.json

  const notReadyProps = {
    cityModel: targetCity,
    language: language,
    categoriesLoaded: false,
    cities
  }

  if (!cities) {
    return notReadyProps
  }

  const categories = state.categories[targetCity.code]

  if (!categories) {
    return notReadyProps
  }

  const json = categories.json[language]

  if (!json) {
    return notReadyProps
  }

  const fileCache = state.fileCache[targetCity.code]

  if (!fileCache || !fileCache.ready) {
    return notReadyProps
  }

  return {
    cityModel: targetCity,
    language: language,
    cities: citiesEndpoint.mapResponse(cities),
    categoriesLoaded: true,
    files: fileCache.files
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
