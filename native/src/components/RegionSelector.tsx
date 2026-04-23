import { groupBy, transform } from 'lodash'
import React, { ReactElement, ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { List as PaperList } from 'react-native-paper'
import styled, { useTheme } from 'styled-components/native'

import { REGION_SEARCH_EXAMPLE, filterSortRegions } from 'shared'
import { RegionModel } from 'shared/api'

import buildConfig from '../constants/buildConfig'
import useAnnounceSearchResultsIOS from '../hooks/useAnnounceSearchResultsIOS'
import NearbyRegions from './NearbyRegions'
import NothingFound from './NothingFound'
import RegionEntry from './RegionEntry'
import RegionGroup from './RegionGroup'
import SearchInput from './SearchInput'
import Text from './base/Text'

const RegionGroupContainer = styled.View`
  flex: 0;
  flex-direction: column;
`

const SearchBar = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

type RegionSelectorProps = {
  regions: RegionModel[]
  navigateToDashboard: (region: RegionModel) => void
}

const RegionSelector = ({ regions, navigateToDashboard }: RegionSelectorProps): ReactElement => {
  const [filterText, setFilterText] = useState<string>('')
  const { t } = useTranslation('landing')
  const theme = useTheme()

  const resultRegions = filterSortRegions(regions, filterText, buildConfig().featureFlags.developerFriendly)
  useAnnounceSearchResultsIOS(resultRegions)

  const filteredRegions = filterSortRegions(regions, '', buildConfig().featureFlags.developerFriendly)
  const exampleRegion = regions.find(region => region.name === REGION_SEARCH_EXAMPLE) ?? filteredRegions[0]

  const renderRegion = (region: RegionModel) => (
    <RegionEntry key={region.code} region={region} query={filterText} navigateToDashboard={navigateToDashboard} />
  )

  const regionGroups = groupBy(resultRegions, (region: RegionModel) => region.sortCategory)
  const regionEntries = transform(
    regionGroups,
    (result: ReactNode[], regions: RegionModel[], key: string) => {
      result.push(
        <RegionGroupContainer key={key}>
          <RegionGroup>{key}</RegionGroup>
          {regions.map(renderRegion)}
        </RegionGroupContainer>,
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
          placeholderText={exampleRegion?.sortingName ?? REGION_SEARCH_EXAMPLE}
          spaceSearch={false}
          description={t('searchRegionDescription', { exampleRegion: exampleRegion?.name ?? REGION_SEARCH_EXAMPLE })}
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
          accessibilityLiveRegion={resultRegions.length === 0 ? 'assertive' : 'polite'}>
          {t('search:searchResultsCount', { count: resultRegions.length })}
        </Text>
        <RegionGroupContainer>
          <PaperList.Subheader>{t('common:nearby')}</PaperList.Subheader>
          <NearbyRegions regions={regions} navigateToDashboard={navigateToDashboard} filterText={filterText} />
        </RegionGroupContainer>
        {resultRegions.length === 0 ? <NothingFound paddingTop /> : regionEntries}
      </View>
    </View>
  )
}

export default RegionSelector
