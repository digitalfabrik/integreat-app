// @flow

import Categories from '../components/Categories'
import { withTheme } from 'styled-components'

import { connect } from 'react-redux'
import citiesEndpoint from '../../../modules/endpoint/endpoints/cities'
import categoriesEndpoint from '../../../modules/endpoint/endpoints/categories'
import type { StateType } from '../../../modules/app/StateType'
import CategoriesMapModel from '../../../modules/endpoint/models/CategoriesMapModel'

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

  const categoriesMap: CategoriesMapModel = categoriesEndpoint.mapResponse(json, {language, city: targetCity})
  return {
    language: language,
    cities: citiesEndpoint.mapResponse(cities),
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
