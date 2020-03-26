// @flow

import React from 'react'

import { CityModel } from '@integreat-app/integreat-api-client'
import styled from 'styled-components/native'
import { type StyledComponent } from 'styled-components'
import type { ThemeType } from '../../../modules/theme/constants/theme'
import normalize from '../../../modules/common/normalize'
import { View } from 'react-native'

const CityListItem: StyledComponent<{}, {}, *> = styled.TouchableHighlight`
  padding: 7px;
  width: 100%;
`

const Label = styled.Text`
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.decorativeFontRegular};
`

const AliasLabel = styled.Text`
  font-size: 11px;
  font-family: ${props => props.theme.fonts.decorativeFontRegular};
  color: ${props => props.theme.colors.textSecondaryColor};
`

type PropType = {|
  city: CityModel,
  filterText: string,
  navigateToDashboard: (city: CityModel) => void,
  theme: ThemeType
|}

class CityEntry extends React.PureComponent<PropType> {
  getMatchedAliases = (city: CityModel, normalizedFilter: string): Array<CityModel> => {
    if (city.aliases && normalizedFilter.length >= 2) {
      return Object.keys(city.aliases)
        .filter(alias => normalize(alias).includes(normalizedFilter))
    }
    return []
  }

  navigateToDashboard = () => {
    this.props.navigateToDashboard(this.props.city)
  }

  render () {
    const { city, theme, filterText } = this.props
    const normalizedFilter = normalize(filterText)
    const aliases = this.getMatchedAliases(city, normalizedFilter)
    return (
      <CityListItem onPress={this.navigateToDashboard}
                    underlayColor={theme.colors.backgroundAccentColor}>
        <View>
          <Label theme={theme}>{city.name}</Label>
          <View style={{
            flexWrap: 'wrap',
            flexDirection: 'row',
            alignItems: 'flex-start'
          }}>
            {
              aliases.length > 0 && aliases.map(
                (alias, index) => <AliasLabel key={alias}
                                              theme={theme}>{index === aliases.length - 1 ? alias : `${alias}, `}</AliasLabel>)
            }
          </View>
        </View>
      </CityListItem>
    )
  }
}

export default CityEntry
