import React, { ReactElement, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { filterSortCities, getNearbyCities, LocationType } from 'shared'
import { CityModel, useLoadAsync } from 'shared/api'

import buildConfig from '../constants/buildConfig'
import getUserLocation from '../utils/getUserLocation'
import CityEntry from './CityEntry'
import CrashTestingIcon from './CrashTestingIcon'
import Failure from './Failure'
import ScrollingSearchBox from './ScrollingSearchBox'

const Container = styled.div`
  padding-top: 22px;
`

const CityListParent = styled.div<{ $stickyTop: number }>`
  position: sticky;
  top: ${props => props.$stickyTop}px;
  height: 30px;
  margin-top: 10px;
  line-height: 30px;
  transition: top 0.2s ease-out;
  background-color: ${props => props.theme.colors.backgroundColor};
  border-bottom: 1px solid ${props => props.theme.colors.themeColor};
`

const SearchCounter = styled.p`
  color: ${props => props.theme.colors.textSecondaryColor};
`

type NearbyCitiesProps = {
  userLocation: LocationType | null
  cities: CityModel[]
  language: string
  filterText: string
}

const NearbyCities = ({ userLocation, cities, language, filterText }: NearbyCitiesProps) => {
  const { t } = useTranslation('landing')
  const nearCities = userLocation
    ? getNearbyCities(
        userLocation,
        cities.filter(city => city.live),
      )
    : []

  return nearCities.length > 0 ? (
    <div key='nearbyCities'>
      <CityListParent $stickyTop={0}>{t('nearbyCities')}</CityListParent>
      {nearCities.map(city => (
        <CityEntry key={city.code} city={city} language={language} filterText={filterText} />
      ))}
    </div>
  ) : null
}

type CitySelectorProps = {
  cities: CityModel[]
  language: string
}

const CitySelector = ({ cities, language }: CitySelectorProps): ReactElement => {
  const [filterText, setFilterText] = useState<string>('')
  const [stickyTop, setStickyTop] = useState<number>(0)
  const { t } = useTranslation('landing')

  const { data: userLocation } = useLoadAsync(
    useCallback(async () => {
      const userLocation = await getUserLocation()
      return userLocation.status === 'ready' ? userLocation.coordinates : null
    }, []),
  )

  const resultCities = filterSortCities(cities, filterText, buildConfig().featureFlags.developerFriendly)

  const groups = [...new Set(resultCities.map(it => it.sortCategory))].map(group => (
    <div key={group}>
      <CityListParent $stickyTop={stickyTop}>{group}</CityListParent>
      {resultCities
        .filter(it => it.sortCategory === group)
        .map(city => (
          <CityEntry key={city.code} city={city} language={language} filterText={filterText} />
        ))}
    </div>
  ))

  return (
    <Container>
      <CrashTestingIcon />
      <ScrollingSearchBox
        filterText={filterText}
        onFilterTextChange={setFilterText}
        placeholderText={t('searchCity')}
        spaceSearch={false}
        onStickyTopChanged={setStickyTop}>
        <SearchCounter>{t('search:searchResultsCount', { count: resultCities.length })}</SearchCounter>
        <NearbyCities userLocation={userLocation} cities={cities} language={language} filterText={filterText} />
        {resultCities.length === 0 ? <Failure errorMessage='search:nothingFound' /> : groups}
      </ScrollingSearchBox>
    </Container>
  )
}

export default CitySelector
