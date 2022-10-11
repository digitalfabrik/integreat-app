import { groupBy, transform } from 'lodash'
import React, { ReactElement, ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { CityModel, filterSortCities } from 'api-client'

import buildConfig from '../constants/buildConfig'
import CityEntry from './CityEntry'
import CityGroup from './CityGroup'
import NearbyCities from './NearbyCities'
import NothingFound from './NothingFound'
import SearchInput from './SearchInput'

const CityGroupContainer = styled.View`
  flex: 0;
  flex-direction: column;
`

const SearchBar = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0 10%;
`

type CitySelectorPropsType = {
  cities: Array<CityModel>
  navigateToDashboard: (city: CityModel) => void
}

const CitySelector = ({ cities, navigateToDashboard }: CitySelectorPropsType): ReactElement => {
  const [filterText, setFilterText] = useState<string>('')
  const { t } = useTranslation('landing')
  const theme = useTheme()

  const resultCities = filterSortCities(cities, filterText, buildConfig().featureFlags.developerFriendly)

  const renderCity = (city: CityModel) => (
    <CityEntry
      key={city.code}
      city={city}
      filterText={filterText}
      navigateToDashboard={navigateToDashboard}
      theme={theme}
    />
  )

  const cityGroups = groupBy(resultCities, (city: CityModel) => city.sortCategory)
  const cityEntries = transform(
    cityGroups,
    (result: ReactNode[], cities: CityModel[], key: string) => {
      result.push(
        <CityGroupContainer key={key}>
          <CityGroup>{key}</CityGroup>
          {cities.map(renderCity)}
        </CityGroupContainer>
      )
    },
    []
  )

  return (
    <View>
      <SearchBar>
        <SearchInput
          filterText={filterText}
          onFilterTextChange={setFilterText}
          placeholderText={t('searchCity')}
          spaceSearch={false}
        />
      </SearchBar>
      <View>
        <CityGroupContainer>
          <CityGroup>{t('nearbyCities')}</CityGroup>
          <NearbyCities cities={cities} navigateToDashboard={navigateToDashboard} filterText={filterText} />
        </CityGroupContainer>
        {resultCities.length === 0 ? <NothingFound paddingTop /> : cityEntries}
      </View>
    </View>
  )
}

export default CitySelector
