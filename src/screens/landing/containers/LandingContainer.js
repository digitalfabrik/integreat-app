// @flow

import * as React from 'react'
import citiesEndpoint from '../../../modules/endpoint/endpoints/cities'
import type { NavigationScreenProp } from 'react-navigation'
import CityModel from '../../../modules/endpoint/models/CityModel'
import { ActivityIndicator, ScrollView } from 'react-native'
import Heading from '../components/Heading'
import styled, { withTheme } from 'styled-components'
import FilterableCitySelector from '../components/FilterableCitySelector'
import type { TFunction } from 'react-i18next'
import { translate } from 'react-i18next'
import type { ThemeType } from 'modules/theme/constants/theme'

const Wrapper = styled.View`
  position: absolute;  
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${props => props.theme.colors.backgroundColor};
  padding: 22px 10px 0;
`

type PropType = {
  language: string,
  navigation: NavigationScreenProp<*>,
  t: TFunction,
  theme: ThemeType
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

  async fetchData (): Promise<void> {
    const payload = await citiesEndpoint.loadData({language: 'de'})
    console.log(payload)
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({data: payload.data})
  }

  componentDidMount () {
    this.fetchData()
  }

  navigateToDashboard = city => {
    this.props.navigation.navigate('Dashboard', {city})
  }

  render () {
    return <Wrapper theme={this.props.theme}>
      <ScrollView>
        {!this.state.data
          ? <ActivityIndicator size='large' color='#0000ff' />
          : <>
            <Heading />
            <FilterableCitySelector theme={this.props.theme} language={'de'} cities={this.state.data} t={this.props.t}
                                    navigateToDashboard={this.navigateToDashboard} />
          </>
        }
      </ScrollView>
    </Wrapper>
  }
}

// $FlowFixMe
export default withTheme(translate('landing')(LandingContainer))
