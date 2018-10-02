// @flow

import Categories from '../components/Categories'
import { withTheme } from 'styled-components'

import { connect } from 'react-redux'
import citiesEndpoint from '../../../modules/endpoint/endpoints/cities'
import categoriesEndpoint from '../../../modules/endpoint/endpoints/categories'
import type { StateType } from '../../../modules/app/StateType'
import CategoriesMapModel from '../../../modules/endpoint/models/CategoriesMapModel'
import { createSelector } from 'reselect'

const categoriesJsonSelector = (state: StateType, props) => state.categories[props.targetCity].json[props.language]

const targetCitySelector = (state: StateType, props) => props.targetCity

const languageSelector = (state: StateType, props) => props.language

const categoriesSelector = createSelector(
  [categoriesJsonSelector, targetCitySelector, languageSelector],
  (json, targetCity, language) => categoriesEndpoint.mapResponse(json, {language, city: targetCity})
)

const citiesJsonSelector = (state: StateType) => state.cities.json

const citiesSelector = createSelector(
  citiesJsonSelector,
  json => citiesEndpoint.mapResponse(json)
)

const mapStateToProps = (state: StateType, ownProps) => {
  const language: string = state.language

  const targetCity: string = ownProps.navigation.getParam('city')
  const targetPath: string = ownProps.navigation.getParam('path') || `/${targetCity}/${language}`

  const cities = state.cities.json

  if (!cities) {
    throw new Error('There are no cities in state!')
  }

  const categories = state.categories[targetCity]

  if (!categories) {
    throw new Error(`The city ${targetCity} is not in the categories state!`)
  }

  const json = categories.json[language]

  if (!json) {
    throw new Error(`The language ${language} is not available in the categories of city ${targetCity}`)
  }

  const fileCache = state.fileCache[targetCity]

  if (!fileCache || !fileCache.ready) {
    throw new Error('There are no files in state!')
  }

  const navigateToCategories = (path: string) => {
    const params = {path, city: targetCity}
    if (ownProps.navigation.push) {
      ownProps.navigation.push('Categories', params)
    }
  }

  const categoriesMap: CategoriesMapModel = categoriesSelector(state, {language, targetCity})
  return {
    language: language,
    cities: citiesSelector(state),
    categories: categoriesMap,
    files: fileCache.files,
    path: targetPath,
    city: targetCity,
    navigateToCategories
  }
}

// $FlowFixMe
const themed = withTheme(Categories)
export default connect(mapStateToProps)(themed)
