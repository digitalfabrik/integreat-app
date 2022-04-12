import React, { ReactElement, useState } from 'react'
import { TFunction } from 'react-i18next'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { CityModel } from 'api-client'

import { LocationInformationType } from '../hooks/useUserLocation'
import CitySelector from './CitySelector'
import SearchInput from './SearchInput'

const SearchBar = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0 10%;
`
type PropsType = {
  cities: Array<CityModel>
  navigateToDashboard: (city: CityModel) => void
  t: TFunction<'landing'>
  locationInformation: LocationInformationType
}

const FilterableCitySelector = ({ cities, navigateToDashboard, locationInformation, t }: PropsType): ReactElement => {
  const [filterText, setFilterText] = useState<string>('')

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
      <CitySelector
        cities={cities}
        navigateToDashboard={navigateToDashboard}
        locationInformation={locationInformation}
        t={t}
        filterText={filterText}
      />
    </View>
  )
}

export default FilterableCitySelector
