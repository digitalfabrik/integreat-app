import React, { ReactElement, useState } from 'react'
import { TFunction } from 'react-i18next'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { CityModel } from 'api-client'
import { ThemeType } from 'build-configs'

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
  theme: ThemeType
  locationInformation: LocationInformationType
}

const FilterableCitySelector = ({ t, theme, ...props }: PropsType): ReactElement => {
  const [filter, setFilter] = useState('')

  return (
    <View>
      <SearchBar>
        <SearchInput
          filterText={filter}
          onFilterTextChange={setFilter}
          placeholderText={t('searchCity')}
          spaceSearch={false}
          theme={theme}
        />
      </SearchBar>
      <CitySelector {...props} t={t} theme={theme} filterText={filter} />
    </View>
  )
}

export default FilterableCitySelector
