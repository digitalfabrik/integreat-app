import React, { useContext, ReactNode, ReactElement } from 'react'
import { transform, groupBy } from 'lodash'
import { CityModel } from 'api-client'
import CityEntry from './CityEntry'
import styled from 'styled-components'
import normalizeSearchString from '../services/normalizeSearchString'
import PlatformContext from '../contexts/PlatformContext'

const CityListParent = styled.div<{ positionStickyDisabled: boolean; stickyTop }>`
  position: ${props => (props.positionStickyDisabled ? 'static' : 'sticky')};
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
  const platform = useContext(PlatformContext)

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
    const sorted = sort(cities)
    const groups = groupBy(sorted, city => city.sortCategory)
    return transform(
      groups,
      (result: Array<ReactNode>, cities, key) => {
        result.push(
          <div key={key}>
            <CityListParent positionStickyDisabled={platform.positionStickyDisabled} stickyTop={stickyTop}>
              {key}
            </CityListParent>
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
