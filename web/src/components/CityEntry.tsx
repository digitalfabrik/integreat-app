import React from 'react'
import Highlighter from 'react-highlight-words'
import { normalizeSearchString } from '../utils/stringUtils'
import { CATEGORIES_ROUTE, CityModel } from 'api-client'
import styled, { withTheme } from 'styled-components'
import type { ThemeType } from 'build-configs'
import { Link } from 'react-router-dom'
import { createPath } from '../routes'

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

type PropsType = {
  language: string
  city: CityModel
  filterText: string
  theme: ThemeType
}

class CityEntry extends React.PureComponent<PropsType> {
  getMatchedAliases = (city: CityModel, normalizedFilter: string): Array<string> => {
    if (city.aliases && normalizedFilter.length >= 1) {
      return Object.keys(city.aliases).filter(alias => normalizeSearchString(alias).includes(normalizedFilter))
    }
    return []
  }

  render() {
    const { city, language, filterText, theme } = this.props
    const normalizedFilter = normalizeSearchString(filterText)
    const aliases = this.getMatchedAliases(city, normalizedFilter)
    return (
      <CityListItem to={createPath(CATEGORIES_ROUTE, { cityCode: city.code, languageCode: language })}>
        <Highlighter
          searchWords={[filterText]}
          sanitize={normalizeSearchString}
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
                sanitize={normalizeSearchString}
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
}

export default withTheme(CityEntry)
