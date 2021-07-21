import React, { ReactNode, ReactElement } from 'react'
import { transform, groupBy } from 'lodash'
import { CityModel } from 'api-client'
import CityEntry from './CityEntry'
import styled from 'styled-components'
import { normalizeSearchString } from '../utils/stringUtils'

const CityListParent = styled.div<{ stickyTop: number }>`
  position: sticky;
  top: ${props => props.stickyTop}px;
  height: 30px;
  margin-top: 10px;
  line-height: 30px;
  transition: top 0.2s ease-out;
  background-color: ${props => props.theme.colors.backgroundColor};
  border-bottom: 1px solid ${props => props.theme.colors.themeColor};
`

type PropsType = {
  cities: Array<CityModel>
  filterText: string
  language: string
  stickyTop?: number
}

const CitySelector = ({ cities, language, filterText, stickyTop = 0 }: PropsType): ReactElement => {
  const filter = (): Array<CityModel> => {
    const normalizedFilter = normalizeSearchString(filterText)

    if (normalizedFilter === 'wirschaffendas') {
      return cities.filter(_city => !_city.live)
    } else {
      return cities
        .filter(_city => _city.live)
        .filter(_city => {
          const isCityName = normalizeSearchString(_city.name).includes(normalizedFilter)
          const isAlias =
            _city._aliases &&
            Object.keys(_city._aliases).some(alias => normalizeSearchString(alias).includes(normalizedFilter))
          return isCityName || isAlias
        })
    }
  }

  // Landkreis should come before Stadt
  const sort = (cities: Array<CityModel>): Array<CityModel> =>
    cities.sort((a, b) => a.sortingName.localeCompare(b.sortingName) || (a.prefix || '').localeCompare(b.prefix || ''))

  const renderList = (cities: Array<CityModel>): ReactNode => {
    // TODO Remove filter once django has replaced wordpress and there is no city with empty path anymore
    const safeCities = cities.filter(city => city.code !== '')
    const sorted = sort(safeCities)
    const groups = groupBy(sorted, city => city.sortCategory)
    return transform(
      groups,
      (result: Array<ReactNode>, cities, key) => {
        result.push(
          <div key={key}>
            <CityListParent stickyTop={stickyTop}>{key}</CityListParent>
            {cities.map(city => (
              <CityEntry key={city.code} city={city} language={language} filterText={filterText} />
            ))}
          </div>
        )
      },
      []
    )
  }

  return <>{renderList(filter())}</>
}

export default CitySelector
