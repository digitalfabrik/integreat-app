// @flow

import
  Categories from '../../../modules/categories/components/Categories'
import { withTheme } from 'styled-components'

import { connect } from 'react-redux'
import type { StateType } from '../../../modules/app/StateType'
import CategoriesMapModel from '../../../modules/endpoint/models/CategoriesMapModel'
import { ScrollView } from 'react-native'
import React from 'react'
import categoriesSelector from '../../../modules/categories/selectors/categoriesSelector'
import citiesSelector from '../../../modules/categories/selectors/citiesSelector'


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
const themed = withTheme(props => <ScrollView><Categories {...props} /></ScrollView>)
export default connect(mapStateToProps)(themed)
