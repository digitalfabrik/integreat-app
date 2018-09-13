// @flow

import * as React from 'react'
import CategoriesMapModel from '../../../modules/endpoint/models/CategoriesMapModel'
import type { NavigationScreenProp, NavigationState } from 'react-navigation'
import { Categories } from '../components/Categories'
import CityModel from '../../../modules/endpoint/models/CityModel'
import TileModel from '../../../modules/common/models/TileModel'
import type { ThemeType } from 'modules/theme/constants/theme'
import { withTheme } from 'styled-components'
import CategoryModel from '../../../modules/endpoint/models/CategoryModel'
import { ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import citiesEndpoint from '../../../modules/endpoint/endpoints/cities'
import categoriesEndpoint from '../../../modules/endpoint/endpoints/categories'

type PropType = {
  navigation: NavigationScreenProp<NavigationState>,
  cities?: Array<CityModel>,
  categories?: CategoriesMapModel,
  theme: ThemeType,
  fetchCategories: { language: string, city: string } => void,
  fetchCities: { language: string } => void
}

class CategoriesContainer extends React.Component<PropType> {
  componentDidMount () {
    if (!this.props.cities) {
      this.props.fetchCategories({language: 'de', city: 'nuernberg'})
    }

    if (!this.props.categories) {
      this.props.fetchCities({language: 'de'})
    }
  }

  onTilePress = (tile: TileModel) => {
    this.navigate(tile.path)
  }

  onItemPress = (category: CategoryModel) => {
    this.navigate(category.path)
  }

  navigate = (path: string) => {
    const params = {
      path: path,
      categories: this.props.categories,
      cities: this.props.cities
    }
    if (this.props.navigation.push) {
      this.props.navigation.push('Categories', params)
    }
  }

  render () {
    const categories = this.props.categories
    if (!categories) {
      return <ActivityIndicator size='large' color='#0000ff' />
    }
    const cities = this.props.cities
    if (!cities) {
      return <ActivityIndicator size='large' color='#0000ff' />
    }
    const city = this.props.navigation.getParam('city')
    const path = this.props.navigation.getParam('path') || '/nuernberg/de'
    return <Categories categories={categories} cities={cities}
                       language={'de'} city={city}
                       path={path}
                       onTilePress={this.onTilePress} onItemPress={this.onItemPress} theme={this.props.theme} />
  }
}

const mapStateToProps = state => {
  const cities = state.data.cities
  const categories = state.data.categories

  if (!cities || !categories) {
    return {}
  }
  return {
    cities: citiesEndpoint.mapResponse(cities),
    categories: categoriesEndpoint.mapResponse(categories, {language: 'de', city: 'nuernberg'})
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchCategories: params => dispatch({type: 'FETCH_CATEGORIES_REQUEST', params, meta: {retry: true}}),
    fetchCities: params => dispatch({type: 'FETCH_CITIES_REQUEST', params, meta: {retry: true}})
  }
}

// $FlowFixMe
export default withTheme(connect(mapStateToProps, mapDispatchToProps)(CategoriesContainer))
