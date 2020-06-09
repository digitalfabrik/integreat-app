// @flow

import React from 'react'

import { CityModel } from '@integreat-app/integreat-api-client'
import styled from 'styled-components/native'
import { type StyledComponent } from 'styled-components'
import type { ThemeType } from '../../../modules/theme/constants/theme'
import normalizeSearchString from '../../../modules/common/normalizeSearchString'
import { View } from 'react-native'
import Highlighter from 'react-native-highlight-words'

const MAX_NUMBER_OF_ALIASES_SHOWN = 3

const CityListItem: StyledComponent<{}, {}, *> = styled.TouchableHighlight`
  padding: 7px;
  width: 100%;
`

const Label = styled(Highlighter)`
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.decorativeFontRegular};
`

const AliasLabel = styled(Highlighter)`
  font-size: 11px;
  font-family: ${props => props.theme.fonts.decorativeFontRegular};
  color: ${props => props.theme.colors.textSecondaryColor};
`

const Aliases = styled.View`
  flex-wrap: wrap;
  flex-direction: row;
  align-items: flex-start;
  margin: 0 5px;
`

type PropType = {|
  city: CityModel,
  filterText: string,
  navigateToDashboard: (city: CityModel) => void,
  theme: ThemeType
|}

class CityEntry extends React.PureComponent<PropType> {
  getMatchingAliases = (city: CityModel, normalizedFilter: string): Array<string> => {
    if (city.aliases && normalizedFilter.length >= 1) {
      return Object.keys(city.aliases)
        .filter(alias => normalizeSearchString(alias).includes(normalizedFilter))
    }
    return []
  }

  navigateToDashboard = () => {
    this.props.navigateToDashboard(this.props.city)
  }

  render () {
    const { city, theme, filterText } = this.props
    const normalizedFilter = normalizeSearchString(filterText)
    const aliases = this.getMatchingAliases(city, normalizedFilter)
    return (
      <CityListItem onPress={this.navigateToDashboard}
                    underlayColor={theme.colors.backgroundAccentColor}>
        <View>
          <Label theme={theme} searchWords={[filterText]} textToHighlight={city.name} sanitize={normalizeSearchString}
                 highlightStyle={{ fontWeight: 'bold' }} />
          {aliases.length > 0 && <Aliases>
            {aliases.slice(0, MAX_NUMBER_OF_ALIASES_SHOWN).map(
              (alias, index) => <AliasLabel key={alias} theme={theme} searchWords={[filterText]}
                                            textToHighlight={index !== aliases.slice(0, MAX_NUMBER_OF_ALIASES_SHOWN).length - 1 ? `${alias}, ` : aliases.length <= MAX_NUMBER_OF_ALIASES_SHOWN ? alias : `${alias},...`}
                                            sanitize={normalizeSearchString}
                                            highlightStyle={{ fontWeight: 'bold' }} />
            )}
          </Aliases>}
        </View>
      </CityListItem>
    )
  }
}

export default CityEntry
