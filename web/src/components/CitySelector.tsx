import { groupBy, transform } from 'lodash'
import React, { ReactElement, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { cityFilter, CityModel, citySort } from 'api-client'

import CityEntry from './CityEntry'
import Failure from './Failure'

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
  const { t } = useTranslation('search')

  const resultCities = cities.filter(cityFilter(filterText)).sort(citySort)

  if (resultCities.length === 0) {
    return <Failure errorMessage='nothingFound' t={t} />
  }

  const groups = groupBy(resultCities, city => city.sortCategory)

  const entries = transform(
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

  return <>{entries}</>
}

export default CitySelector
