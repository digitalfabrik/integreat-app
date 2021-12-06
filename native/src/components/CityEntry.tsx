import React, { ReactElement } from 'react'
import { Text } from 'react-native'
import Highlighter from 'react-native-highlight-words'
import styled, { useTheme } from 'styled-components/native'

import { CityModel } from 'api-client'

import testID from '../testing/testID'
import { normalizeSearchString } from '../utils/helpers'

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
}

const CityEntry = ({ city, filterText, navigateToDashboard }: PropType): ReactElement => {
  const theme = useTheme()

  const getMatchingAliases = (city: CityModel, normalizedFilter: string): Array<string> => {
    if (city.aliases && normalizedFilter.length >= 1) {
      return Object.keys(city.aliases).filter(alias => normalizeSearchString(alias).includes(normalizedFilter))
    }

    return []
  }

  const normalizedFilter = normalizeSearchString(filterText)
  const aliases = getMatchingAliases(city, normalizedFilter).slice(0, MAX_NUMBER_OF_ALIASES_SHOWN)
  const sliceNeeded = aliases.length > MAX_NUMBER_OF_ALIASES_SHOWN
  return (
    <CityListItem
      {...testID('City-Entry')}
      onPress={() => navigateToDashboard(city)}
      underlayColor={theme.colors.backgroundAccentColor}>
      <>
        <Label
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
                    <Separator>,</Separator>
                    <Separator> </Separator>
                  </>
                )}
              </React.Fragment>
            ))}
            {sliceNeeded && (
              <>
                <Separator>,</Separator>
                <Separator> </Separator>
                <Separator>...</Separator>
              </>
            )}
          </Aliases>
        )}
      </>
    </CityListItem>
  )
}

export default CityEntry
