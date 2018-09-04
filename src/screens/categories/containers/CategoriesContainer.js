// @flow

import * as React from 'react'
import categoriesEndpoint from '../../../modules/endpoint/endpoints/categories'
import citiesEndpoint from '../../../modules/endpoint/endpoints/cities'
import CategoriesMapModel from '../../../modules/endpoint/models/CategoriesMapModel'
import type { NavigationScreenProp, NavigationState } from 'react-navigation'
import { Categories } from '../components/Categories'
import CityModel from '../../../modules/endpoint/models/CityModel'
import TileModel from '../../../modules/common/models/TileModel'
import type { ThemeType } from 'modules/theme/constants/theme'
import { withTheme } from 'styled-components'
import CategoryModel from '../../../modules/endpoint/models/CategoryModel'
import { ActivityIndicator } from 'react-native'

type PropType = {
  navigation: NavigationScreenProp<NavigationState>,
  theme: ThemeType
}

type StateType = {
  categories: ?CategoriesMapModel | null,
  cities: ?Array<CityModel> | null
}

class CategoriesContainer extends React.Component<PropType, StateType> {
  constructor () {
    super()
    this.state = {categories: null, cities: null}
  }

  async fetchData (): Promise<void> {
    const categoriesPayload = await categoriesEndpoint.loadData({language: 'de', city: 'nuernberg'})
    const citiesPayload = await citiesEndpoint.loadData({language: 'de'})

    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({categories: categoriesPayload.data})
    this.setState({cities: citiesPayload.data})
  }

  componentDidMount () {
    if (!this.getCategories() || !this.getCities()) {
      this.fetchData()
    }
  }

  getCategories (): ?CategoriesMapModel | null {
    return this.props.navigation.getParam('categories') || this.state.categories
  }

  getCities (): ?Array<CityModel> | null {
    return this.props.navigation.getParam('cities') || this.state.cities
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
      categories: this.getCategories(),
      cities: this.getCities()
    }
    if (this.props.navigation.push) {
      this.props.navigation.push('Categories', params)
    }
  }

  render () {
    const categories = this.getCategories()
    if (!categories) {
      return <ActivityIndicator size='large' color='#0000ff' />
    }
    const cities = this.getCities()
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

// $FlowFixMe
export default withTheme(CategoriesContainer)
