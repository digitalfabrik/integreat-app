// @flow

import Categories from '../../../modules/categories/components/Categories'
import { withTheme } from 'styled-components'

import { connect } from 'react-redux'
import type { StateType } from '../../../modules/app/StateType'
import { CityModel } from '@integreat-app/integreat-api-client'
import { ScrollView } from 'react-native'
import React from 'react'
import MemoryDatabase from '../../../modules/endpoint/MemoryDatabase'
import withMemoryDatabase from '../../../modules/endpoint/hocs/withMemoryDatabase'

const mapStateToProps = (state: StateType, ownProps) => {
  const language = state.language

  const database: MemoryDatabase = ownProps.database
  const targetCityCode: string = ownProps.navigation.getParam('city')
  const targetPath: string = ownProps.navigation.getParam('path') || `/${targetCityCode}/${language}`

  if (!database.hasContext()) {
    throw new Error('Context must be set!')
  }

  const navigateToCategories = (path: string) => {
    const params = {path, city: targetCityCode}
    if (ownProps.navigation.push) {
      ownProps.navigation.push('Categories', params)
    }
  }

  const errorMessage = state.cities.error || state.categories.error
  if (errorMessage) {
    console.error(errorMessage)
  }

  return {
    language: language,
    cities: database.cities,
    categories: database.categoriesMap,
    files: database.resourceCache,
    path: targetPath,
    city: targetCityCode,
    navigateToCategories
  }
}

// $FlowFixMe
const themed = withTheme(props => <ScrollView><Categories {...props} /></ScrollView>)
// $FlowFixMe connect()
export default withMemoryDatabase(connect(mapStateToProps)(themed))
