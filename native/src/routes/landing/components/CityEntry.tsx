import React from 'react'
import { CityModel } from 'api-client'
import styled from 'styled-components/native'
import { ThemeType } from 'build-configs/dist/ThemeType'
import normalizeSearchString from '../../../modules/common/normalizeSearchString'
import { Text } from 'react-native'
import Highlighter from 'react-native-highlight-words'

const MAX_NUMBER_OF_ALIASES_SHOWN = 3

const CityListItem = styled.TouchableHighlight`
  flex: 1;
  padding: 7px;
  width: 100%;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: flex-start;
`
const Label = styled(Highlighter)`
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.native.decorativeFontRegular};
`
const AliasLabel = styled(Highlighter)`
  font-size: 11px;
  font-family: ${props => props.theme.fonts.native.decorativeFontRegular};
  color: ${props => props.theme.colors.textSecondaryColor};
`
const Separator = styled(Text)`
  font-size: 11px;
  font-family: ${props => props.theme.fonts.native.decorativeFontRegular};
  color: ${props => props.theme.colors.textSecondaryColor};
`
const Aliases = styled.View`
  flex: 1;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: flex-start;
  margin: 0 5px;
`

type PropType = {
  city: CityModel
  filterText: string
  navigateToDashboard: (city: CityModel) => void
  theme: ThemeType
}

class CityEntry extends React.PureComponent<PropType> {
  getMatchingAliases = (city: CityModel, normalizedFilter: string): Array<string> => {
    if (city.aliases && normalizedFilter.length >= 1) {
      return Object.keys(city.aliases).filter(alias => normalizeSearchString(alias).includes(normalizedFilter))
    }

    return []
  }

  navigateToDashboard = () => {
    this.props.navigateToDashboard(this.props.city)
  }

  render() {
    const { city, theme, filterText } = this.props
    const normalizedFilter = normalizeSearchString(filterText)
    const aliases = this.getMatchingAliases(city, normalizedFilter).slice(0, MAX_NUMBER_OF_ALIASES_SHOWN)
    const sliceNeeded = aliases.length > MAX_NUMBER_OF_ALIASES_SHOWN
    return (
      <CityListItem onPress={this.navigateToDashboard} underlayColor={theme.colors.backgroundAccentColor}>
        <>
          <Label
            theme={theme}
            searchWords={[filterText]}
            autoEscape
            textToHighlight={city.name}
            sanitize={normalizeSearchString}
            highlightStyle={{
              fontWeight: 'bold'
            }}
          />
          {aliases.length > 0 && (
            <Aliases>
              {aliases.map((alias, index) => (
                <React.Fragment key={alias}>
                  <AliasLabel
                    theme={theme}
                    searchWords={[filterText]}
                    textToHighlight={alias}
                    autoEscape
                    sanitize={normalizeSearchString}
                    highlightStyle={{
                      fontWeight: 'bold'
                    }}
                  />
                  {index !== aliases.length - 1 && (
                    <>
                      <Separator theme={theme}>,</Separator>
                      <Separator theme={theme}> </Separator>
                    </>
                  )}
                </React.Fragment>
              ))}
              {sliceNeeded && (
                <>
                  <Separator theme={theme}>,</Separator>
                  <Separator theme={theme}> </Separator>
                  <Separator theme={theme}>...</Separator>
                </>
              )}
            </Aliases>
          )}
        </>
      </CityListItem>
    )
  }
}

export default CityEntry
