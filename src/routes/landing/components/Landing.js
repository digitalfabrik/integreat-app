// @flow

import * as React from 'react'
import { CityModel } from '@integreat-app/integreat-api-client'
import { View } from 'react-native'
import Heading from '../components/Heading'
import styled, { type StyledComponent } from 'styled-components/native'
import FilterableCitySelector from '../components/FilterableCitySelector'
import type { TFunction } from 'react-i18next'
import type { ThemeType } from '../../../modules/theme/constants/theme'

const Wrapper: StyledComponent<{}, ThemeType, *> = styled(View)`
  background-color: ${props => props.theme.colors.backgroundColor};
  padding: 11px 10px 0;
`

export type PropsType = {|
  cities: Array<CityModel>,
  language: string,
  t: TFunction,
  theme: ThemeType,
  navigateToDashboard: (cityCode: string, language: string) => void
|}

class Landing extends React.Component<PropsType> {

  navigateToDashboard = (cityModel: CityModel) => {
    const { navigateToDashboard, language } = this.props
    navigateToDashboard(cityModel.code, language)
  }

  render () {
    const { theme, cities, t } = this.props

    return <Wrapper theme={theme}>
      <Heading />
      <FilterableCitySelector theme={theme} cities={cities} t={t} navigateToDashboard={this.navigateToDashboard} />
    </Wrapper>
  }
}

export default Landing
