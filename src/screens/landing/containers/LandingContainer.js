// @flow

import * as React from 'react'
import citiesEndpoint from '../../../modules/endpoint/endpoints/cities'
import { Text } from 'react-native-elements'
import type { NavigationScreenProp } from 'react-navigation'
import CityModel from '../../../modules/endpoint/models/CityModel'
import FilterableCitySelector from '../components/FilterableCitySelector'
import { ScrollView } from 'react-native'
import Heading from '../components/Heading'
import styled from 'styled-components'

const Wrapper = styled.View`
  padding-top: 22px;
`

type PropType = {
  language: string,
  navigation: NavigationScreenProp<*>
}

type StateType = {
  data: Array<CityModel> | null
}

/**
 * This shows the landing screen. This is a container because it depends on endpoints.
 */
class LandingContainer extends React.Component<PropType, StateType> {
  constructor () {
    super()
    this.state = {data: null}
  }

  async fetchData (): void {
    const payload = await citiesEndpoint.loadData({language: 'de'})
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
    const {language, cities} = this.props
    return <ScrollView>
      <Wrapper>
        <Heading />
        <FilterableCitySelector language={'de'} cities={this.state.data} />
      </Wrapper>
    </ScrollView>
  }
}

export default LandingContainer
