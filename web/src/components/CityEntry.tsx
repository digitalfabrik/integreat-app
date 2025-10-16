import styled from '@emotion/styled'
import React, { ReactElement } from 'react'
import { Link } from 'react-router'

import { cityContentPath, normalizeString } from 'shared'
import { CityModel } from 'shared/api'

import Highlighter from './Highlighter'

const MAX_NUMBER_OF_ALIASES = 3

const CityListItem = styled(Link)`
  display: flex;
  flex-direction: column;
  padding: 7px;
  color: inherit;
  text-decoration: inherit;

  &:hover {
    color: inherit;
    text-decoration: inherit;
    transition: background-color 0.5s ease;
    background-color: ${props => props.theme.colors.backgroundAccentColor};
  }
`

const AliasContainer = styled.div`
  margin: 0 4px;
  font-size: 12px;
`

const StyledHighlighter = styled(Highlighter)`
  display: inline-block;
`

type CityEntryProps = {
  language: string
  city: CityModel
  filterText: string
}

const CityEntry = ({ filterText, city, language }: CityEntryProps): ReactElement => {
  const normalizedFilter = normalizeString(filterText)
  const aliases =
    city.aliases && normalizedFilter.length >= 1
      ? Object.keys(city.aliases).filter(alias => normalizeString(alias).includes(normalizedFilter))
      : []

  return (
    <CityListItem to={cityContentPath({ cityCode: city.code, languageCode: language })}>
      <Highlighter search={filterText} text={city.name} />
      <AliasContainer>
        {aliases.slice(0, MAX_NUMBER_OF_ALIASES).map((alias, index) => (
          <span key={alias}>
            <StyledHighlighter search={filterText} text={alias} />
            {index !== aliases.length - 1 && <span>, </span>}
          </span>
        ))}
        {aliases.length > MAX_NUMBER_OF_ALIASES && <span> ... </span>}
      </AliasContainer>
    </CityListItem>
  )
}

export default CityEntry
