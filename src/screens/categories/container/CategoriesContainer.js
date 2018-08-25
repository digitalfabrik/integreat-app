// @flow

import * as React from 'react'
import Categories from '../components/Categories'
import categoriesEndpoint from '../../../modules/endpoint/endpoints/categories'
import CategoriesMapModel from '../../../modules/endpoint/models/CategoriesMapModel'
import { Text } from 'react-native-elements'
import type { NavigationScreenProp } from 'react-navigation'

type PropType = {
  navigation: NavigationScreenProp<*>
}

type StateType = {
  data: CategoriesMapModel | null
}

export default class CategoriesContainer extends React.Component<PropType, StateType> {
  constructor () {
    super()
    this.state = {data: null}
  }

  async fetchData (): void {
    const payload = await categoriesEndpoint.loadData({language: 'de', city: 'augsburg'})
    console.log(payload)
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({data: payload.data})
  }

  componentDidMount () {
    this.fetchData()
  }

  render () {
    if (!this.state.data) {
      return <Text>Test</Text>
    }
    return <Categories categories={this.state.data} navigation={this.props.navigation} />
  }
}
