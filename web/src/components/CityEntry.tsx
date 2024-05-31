import React, { ReactElement } from 'react'
import Highlighter from 'react-highlight-words'
import { Link } from 'react-router-dom'
import styled, { useTheme } from 'styled-components'

import { cityContentPath, normalizeString } from 'shared'
import { CityModel } from 'shared/api'

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

const AliasItem = styled(Highlighter)`
  display: inline-block;
`

type CityEntryProps = {
  language: string
  city: CityModel
  filterText: string
}

const CityEntry = ({ filterText, city, language }: CityEntryProps): ReactElement => {
  const theme = useTheme()
  const normalizedFilter = normalizeString(filterText)
  const aliases =
    city.aliases && normalizedFilter.length >= 1
      ? Object.keys(city.aliases).filter(alias => normalizeString(alias).includes(normalizedFilter))
      : []

  return (
    <CityListItem to={cityContentPath({ cityCode: city.code, languageCode: language })}>
      <Highlighter
        searchWords={[filterText]}
        sanitize={normalizeString}
        aria-label={city.name}
        textToHighlight={city.name}
        autoEscape
        highlightStyle={{ backgroundColor: theme.colors.backgroundColor, fontWeight: 'bold' }}
      />
      <div style={{ margin: '0 5px', fontSize: '12px' }}>
        {aliases.slice(0, MAX_NUMBER_OF_ALIASES).map((alias, index) => (
          <span key={alias}>
            <AliasItem
              aria-label={alias}
              searchWords={[filterText]}
              sanitize={normalizeString}
              textToHighlight={alias}
              autoEscape
              highlightStyle={{ backgroundColor: theme.colors.backgroundColor, fontWeight: 'bold' }}
            />
            {index !== aliases.length - 1 && <span>, </span>}
          </span>
        ))}
        {aliases.length > MAX_NUMBER_OF_ALIASES && <span> ... </span>}
      </div>
    </CityListItem>
  )
}

export default CityEntry
