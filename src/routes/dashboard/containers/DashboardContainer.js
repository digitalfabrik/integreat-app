// @flow

import type { Dispatch } from 'redux'

import { connect } from 'react-redux'
import Dashboard from '../components/Dashboard'
import toggleDarkMode from 'modules/theme/actions/toggleDarkMode'
import { offlineActionTypes } from 'react-native-offline'
import type { StateType } from '../../../modules/app/StateType'
import { CategoriesMapModel, CityModel } from '@integreat-app/integreat-api-client'
import { withTheme } from 'styled-components'
import categoriesSelector from '../../../modules/categories/selectors/categoriesSelector'
import citiesSelector from '../../../modules/categories/selectors/citiesSelector'
import withError from '../../../modules/error/hocs/withError'

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
  const language = state.language
  const cities = state.cities

  const targetCity: CityModel = ownProps.navigation.getParam('cityModel')
  const targetPath: string = ownProps.navigation.getParam('path') || `/${targetCity.code}/${language}`

  const notReadyProps = {
    cityModel: targetCity,
    language: language,
    cities: cities.json
  }

  if (!cities.json) {
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

  const navigateToCategories = (path: string) => {
    const params = {path, city: targetCity.code}
    if (ownProps.navigation.push) {
      ownProps.navigation.push('Categories', params)
    }
  }

  const errorMessage = cities.error || categories.error || fileCache.error
  if (errorMessage) {
    console.error(errorMessage)
  }

  const categoriesMap: CategoriesMapModel = categoriesSelector(state, { language, targetCity: targetCity.code })
  return {
    cityModel: targetCity,
    language: language,
    cities: citiesSelector(state),
    navigateToCategories,
    path: targetPath,
    categories: categoriesMap,
    files: fileCache.files,
    error: errorMessage
  }
}

// $FlowFixMe
const themed = withTheme(Dashboard)
// $FlowFixMe connect()
export default connect(mapStateToProps, mapDispatchToProps)(withError(themed))
