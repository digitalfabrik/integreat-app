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

type PropType = {
  navigation: NavigationScreenProp<NavigationState>,
  cities: Array<CityModel>,
  categories: CategoriesMapModel,
  theme: ThemeType,
  fetch: { language: string, city: string } => void
}

class CategoriesContainer extends React.Component<PropType> {
  componentDidMount () {
    this.props.fetch({language: 'de', city: 'nuernberg'})
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
  return {
    cities: state.cities.data,
    categories: state.categories.data
  }
}

const mapDispatchToProps = dispatch => {
  return {fetch: params => dispatch({type: 'FETCH_CATEGORIES_REQUEST', params, meta: {retry: true}})}
}

// $FlowFixMe
export default withTheme(connect(mapStateToProps, mapDispatchToProps)(CategoriesContainer))
