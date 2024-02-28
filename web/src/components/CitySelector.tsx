import React, { ReactElement, ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { filterSortCities } from 'shared'
import { CityModel } from 'shared/api'

import buildConfig from '../constants/buildConfig'
import CityEntry from './CityEntry'
import Failure from './Failure'
import Heading from './Heading'
import ScrollingSearchBox from './ScrollingSearchBox'

const Container = styled.div`
  padding-top: 22px;
`

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

type CitySelectorProps = {
  cities: Array<CityModel>
  language: string
}

const CitySelector = ({ cities, language }: CitySelectorProps): ReactElement => {
  const [filterText, setFilterText] = useState<string>('')
  const [stickyTop, setStickyTop] = useState<number>(0)
  const { t } = useTranslation('landing')

  const resultCities = filterSortCities(cities, filterText, buildConfig().featureFlags.developerFriendly)

  const groups = resultCities.reduce(
    (groupedCities, currentCity) => ({
      ...groupedCities,
      [currentCity.sortCategory]: [...(groupedCities[currentCity.sortCategory] ?? []), currentCity],
    }),
    {} as { [key: string]: CityModel[] },
  )

  const entries = Object.entries(groups).map(
    ([key, cities]) => (
      <div key={key}>
        <CityListParent stickyTop={stickyTop}>{key}</CityListParent>
        {cities.map(city => (
          <CityEntry key={city.code} city={city} language={language} filterText={filterText} />
        ))}
      </div>
    ),
    [] as ReactNode[],
  )

  return (
    <Container>
      <Heading />
      <ScrollingSearchBox
        filterText={filterText}
        onFilterTextChange={setFilterText}
        placeholderText={t('searchCity')}
        spaceSearch={false}
        onStickyTopChanged={setStickyTop}>
        {resultCities.length === 0 ? <Failure errorMessage='search:nothingFound' /> : entries}
      </ScrollingSearchBox>
    </Container>
  )
}

export default CitySelector
