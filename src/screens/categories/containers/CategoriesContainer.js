// @flow

import * as React from 'react'
import categoriesEndpoint from '../../../modules/endpoint/endpoints/categories'
import citiesEndpoint from '../../../modules/endpoint/endpoints/cities'
import CategoriesMapModel from '../../../modules/endpoint/models/CategoriesMapModel'
import { Text } from 'react-native-elements'
import type { NavigationScreenProp } from 'react-navigation'
import { CategoriesPage } from './CategoriesPage'

type PropType = {
  navigation: NavigationScreenProp<*>
}

type StateType = {
  categories: CategoriesMapModel | null,
  cities: Array<CityModel> | null
}

export default class CategoriesContainer extends React.Component<PropType, StateType> {
  constructor () {
    super()
    this.state = {categories: null, cities: null}
  }

  async fetchData (): void {
    const categoriesPayload = await categoriesEndpoint.loadData({language: 'de', city: 'augsburg'})
    const citiesPayload = await citiesEndpoint.loadData({language: 'de'})

    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({categories: categoriesPayload.data})
    this.setState({cities: citiesPayload.data})
  }

  componentDidMount () {
    this.fetchData()
  }

  render () {
    if (!this.state.categories) {
      return <Text>Test</Text>
    }
    if (!this.state.cities) {
      return <Text>Test</Text>
    }
    return <CategoriesPage categories={this.state.categories} cities={this.state.categories}
                           language={'de'}
                           city={this.props.navigation.getParam('city')}
                           path={'/augsburg/de'}
                           navigation={this.props.navigation} />
  }
}
