// @flow

import * as React from 'react'
import categoriesEndpoint from '../../../modules/endpoint/endpoints/categories'
import citiesEndpoint from '../../../modules/endpoint/endpoints/cities'
import CategoriesMapModel from '../../../modules/endpoint/models/CategoriesMapModel'
import { Text } from 'react-native-elements'
import type { NavigationScreenProp } from 'react-navigation'
import { Categories } from '../components/Categories'
import CityModel from '../../../modules/endpoint/models/CityModel'
import TileModel from '../../../modules/common/models/TileModel'
import type { ThemeType } from '../../../modules/layout/constants/theme'
import { withTheme } from 'styled-components'

type PropType = {
  navigation: NavigationScreenProp<*>,
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
    const categoriesPayload = await categoriesEndpoint.loadData({language: 'de', city: 'augsburg'})
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
    // Alert.alert(tile.path)
    if (!this.props.navigation.push) {
      return
    }
    this.props.navigation.push('Categories', {
      path: tile.path,
      categories: this.getCategories(),
      cities: this.getCities()
    })
  }

  render () {
    const categories = this.getCategories()
    if (!categories) {
      return <Text>Test</Text>
    }
    const cities = this.getCities()
    if (!cities) {
      return <Text>Test</Text>
    }
    return <Categories categories={categories} cities={cities}
                       language={'de'}
                       city={this.props.navigation.getParam('city')}
                       path={this.props.navigation.getParam('path') || '/augsburg/de'}
                       onTilePress={this.onTilePress} theme={this.props.theme} />
  }
}

// $FlowFixMe
export default withTheme(CategoriesContainer)
