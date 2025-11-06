import React, { Fragment, memo, ReactElement, useContext } from 'react'
import { Text } from 'react-native'
import styled from 'styled-components/native'

import { normalizeString } from 'shared'
import { CityModel } from 'shared/api'

import { AppContext } from '../contexts/AppContextProvider'
import testID from '../testing/testID'
import Highlighter from './Highlighter'
import Pressable from './base/Pressable'

const MAX_NUMBER_OF_ALIASES_SHOWN = 3

const CityListItem = styled(Pressable)`
  flex: 1;
  padding: 7px;
  width: 100%;
  flex-flow: column wrap;
  align-items: flex-start;
`
const Label = styled(Highlighter)`
  color: ${props => props.theme.legacy.colors.textColor};
  font-family: ${props => props.theme.legacy.fonts.native.decorativeFontRegular};
`
const AliasLabel = styled(Highlighter)`
  font-size: 11px;
  font-family: ${props => props.theme.legacy.fonts.native.decorativeFontRegular};
  color: ${props => props.theme.legacy.colors.textSecondaryColor};
`
const Separator = styled(Text)`
  font-size: 11px;
  font-family: ${props => props.theme.legacy.fonts.native.decorativeFontRegular};
  color: ${props => props.theme.legacy.colors.textSecondaryColor};
`
const AliasesWrapper = styled.View`
  flex: 1;
  flex-flow: row wrap;
  align-items: flex-start;
  margin: 0 5px;
`

type CityEntryProps = {
  city: CityModel
  query: string
  navigateToDashboard: (city: CityModel) => void
}

const CityEntry = ({ city, query, navigateToDashboard }: CityEntryProps): ReactElement => {
  const normalizedQuery = normalizeString(query)
  const matchingAliases =
    city.aliases && normalizedQuery.length >= 1
      ? Object.keys(city.aliases).filter(alias => normalizeString(alias).includes(normalizedQuery))
      : []
  const aliases = matchingAliases.slice(0, MAX_NUMBER_OF_ALIASES_SHOWN)
  const { languageCode } = useContext(AppContext)

  const Aliases =
    aliases.length > 0 ? (
      <AliasesWrapper>
        {aliases.map((it, index) => (
          <Fragment key={it}>
            <AliasLabel search={normalizedQuery} text={it} />
            {index !== aliases.length - 1 && (
              <>
                <Separator>,</Separator>
                <Separator> </Separator>
              </>
            )}
          </Fragment>
        ))}
        {matchingAliases.length > MAX_NUMBER_OF_ALIASES_SHOWN && (
          <>
            <Separator>,</Separator>
            <Separator> </Separator>
            <Separator>...</Separator>
          </>
        )}
      </AliasesWrapper>
    ) : null

  return (
    <CityListItem
      role='link'
      {...testID('City-Entry')}
      onPress={() => navigateToDashboard(city)}
      accessibilityLanguage={languageCode}>
      <>
        <Label search={normalizedQuery} text={city.name} />
        {Aliases}
      </>
    </CityListItem>
  )
}

export default memo(CityEntry)
