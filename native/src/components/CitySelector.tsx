import { groupBy, transform } from 'lodash'
import React, { ReactElement, ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { List as PaperList } from 'react-native-paper'
import styled, { useTheme } from 'styled-components/native'

import { CITY_SEARCH_EXAMPLE, filterSortCities } from 'shared'
import { CityModel } from 'shared/api'

import buildConfig from '../constants/buildConfig'
import useAnnounceSearchResultsIOS from '../hooks/useAnnounceSearchResultsIOS'
import CityEntry from './CityEntry'
import CityGroup from './CityGroup'
import NearbyCities from './NearbyCities'
import NothingFound from './NothingFound'
import SearchInput from './SearchInput'
import Text from './base/Text'

const CityGroupContainer = styled.View`
  flex: 0;
  flex-direction: column;
`

const SearchBar = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

type CitySelectorProps = {
  cities: CityModel[]
  navigateToDashboard: (city: CityModel) => void
}

const CitySelector = ({ cities, navigateToDashboard }: CitySelectorProps): ReactElement => {
  const [filterText, setFilterText] = useState<string>('')
  const { t } = useTranslation('landing')
  const theme = useTheme()

  const resultCities = filterSortCities(cities, filterText, buildConfig().featureFlags.developerFriendly)
  useAnnounceSearchResultsIOS(resultCities)

  const exampleCity = cities.find(city => city.name === CITY_SEARCH_EXAMPLE) ?? cities[0]

  const renderCity = (city: CityModel) => (
    <CityEntry key={city.code} city={city} query={filterText} navigateToDashboard={navigateToDashboard} />
  )

  const cityGroups = groupBy(resultCities, (city: CityModel) => city.sortCategory)
  const cityEntries = transform(
    cityGroups,
    (result: ReactNode[], cities: CityModel[], key: string) => {
      result.push(
        <CityGroupContainer key={key}>
          <CityGroup>{key}</CityGroup>
          {cities.map(renderCity)}
        </CityGroupContainer>,
      )
    },
    [],
  )

  return (
    <View>
      <SearchBar>
        <SearchInput
          filterText={filterText}
          onFilterTextChange={setFilterText}
          placeholderText={exampleCity?.sortingName ?? CITY_SEARCH_EXAMPLE}
          spaceSearch={false}
          description={t('searchCityDescription', { exampleCity: exampleCity?.name ?? CITY_SEARCH_EXAMPLE })}
        />
      </SearchBar>
      <View>
        <Text
          variant='h5'
          style={{
            margin: 16,
            marginHorizontal: 0,
            marginBottom: 12,
            color: theme.colors.onBackground,
          }}
          accessibilityLiveRegion={resultCities.length === 0 ? 'assertive' : 'polite'}>
          {t('search:searchResultsCount', { count: resultCities.length })}
        </Text>
        <CityGroupContainer>
          <PaperList.Subheader>{t('common:nearby')}</PaperList.Subheader>
          <NearbyCities cities={cities} navigateToDashboard={navigateToDashboard} filterText={filterText} />
        </CityGroupContainer>
        {resultCities.length === 0 ? <NothingFound paddingTop /> : cityEntries}
      </View>
    </View>
  )
}

export default CitySelector
