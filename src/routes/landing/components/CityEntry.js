// @flow

import React from 'react'

import { CityModel } from '@integreat-app/integreat-api-client'
import styled, { type StyledComponent } from 'styled-components/native'
import type { ThemeType } from '../../../modules/theme/constants/theme'

const CityListItem: StyledComponent<{}, {}, *> = styled.TouchableHighlight`
  padding: 7px;
`

const Label = styled.Text`
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.decorativeFontRegular};
`

type PropType = {|
  city: CityModel,
  filterText: string,
  navigateToDashboard: (city: CityModel) => void,
  theme: ThemeType
|}

class CityEntry extends React.PureComponent<PropType> {
  navigateToDashboard = () => {
    this.props.navigateToDashboard(this.props.city)
  }

  render () {
    const { city, theme } = this.props
    return (
        <CityListItem onPress={this.navigateToDashboard}
                      underlayColor={this.props.theme.colors.backgroundAccentColor}>
          <Label theme={theme}>{city.name}</Label>
        </CityListItem>
    )
  }
}

export default CityEntry
