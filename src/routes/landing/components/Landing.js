// @flow

import * as React from 'react'
import { CityModel } from '@integreat-app/integreat-api-client'
import { ActivityIndicator, ScrollView } from 'react-native'
import Heading from '../components/Heading'
import styled from 'styled-components/native'
import FilterableCitySelector from '../components/FilterableCitySelector'
import type { TFunction } from 'react-i18next'
import type { ThemeType } from '../../../modules/theme/constants/theme'
import type { StoreActionType } from '../../../modules/app/StoreActionType'
import type { NavigationScreenProp } from 'react-navigation'

const Wrapper = styled(ScrollView)`
  background-color: ${props => props.theme.colors.backgroundColor};
  padding: 11px 10px 0;
`

export type PropsType = {
  navigation: NavigationScreenProp<*>,
  i18n: Object,
  cities?: Array<CityModel>,
  language: string,
  t: TFunction,
  theme: ThemeType,
  navigateToDashboard: (cityCode: string, language: string) => StoreActionType,
  fetchCities: () => StoreActionType
}

/**
 * This shows the landing screen. This is a container because it depends on endpoints.
 */
class Landing extends React.Component<PropsType> {
  componentDidMount () {
    if (!this.props.cities) {
      this.props.fetchCities()
    }
  }

  navigateToDashboard = (cityModel: CityModel) => {
    const { navigateToDashboard, language } = this.props
    navigateToDashboard(cityModel.code, language)
  }

  render () {
    const {theme, cities, t} = this.props
    return <Wrapper theme={theme}>
      {!cities
        ? <ActivityIndicator size='large' color='#0000ff' />
        : <>
          <Heading theme={theme} />
          <FilterableCitySelector theme={theme} cities={cities} t={t} navigateToDashboard={this.navigateToDashboard} />
        </>
      }
    </Wrapper>
  }
}

export default Landing
