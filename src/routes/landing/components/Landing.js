// @flow

import * as React from 'react'
import { CityModel } from '@integreat-app/integreat-api-client'
import { ActivityIndicator, ScrollView } from 'react-native'
import Heading from '../components/Heading'
import styled from 'styled-components/native'
import FilterableCitySelector from '../components/FilterableCitySelector'
import type { TFunction } from 'react-i18next'
import type { ThemeType } from 'modules/theme/constants/theme'

const Wrapper = styled(ScrollView)`
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
  cities?: Array<CityModel>,
  navigateToCategory: (cityCode: string, language: string, path: string) => void,
  t: TFunction,
  theme: ThemeType,
  fetchCities: () => void
}

/**
 * This shows the landing screen. This is a container because it depends on endpoints.
 */
class LandingContainer extends React.Component<PropType> {
  componentDidMount () {
    if (!this.props.cities) {
      this.props.fetchCities()
    }
  }

  navigateToDashboard = (cityModel: CityModel) => {
    const language = this.props.language
    this.props.navigateToCategory(cityModel.code, language, `/${cityModel.code}/${language}`)
  }

  render () {
    const {theme, cities, language, t} = this.props
    return <Wrapper theme={theme}>
      {!cities
        ? <ActivityIndicator size='large' color='#0000ff' />
        : <>
          <Heading theme={theme} />
          <FilterableCitySelector theme={theme} language={language} cities={cities}
                                  t={t} navigateToDashboard={this.navigateToDashboard} />
        </>
      }
    </Wrapper>
  }
}

export default LandingContainer
