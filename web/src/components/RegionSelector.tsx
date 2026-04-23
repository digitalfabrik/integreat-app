import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { REGION_SEARCH_EXAMPLE, filterSortRegions } from 'shared'
import { RegionModel } from 'shared/api'

import buildConfig from '../constants/buildConfig'
import NearbyRegions from './NearbyRegions'
import RegionListGroup from './RegionListGroup'
import SearchInput from './SearchInput'
import SkeletonList from './SkeletonList'
import H1 from './base/H1'
import List from './base/List'

type RegionSelectorProps = {
  regions: RegionModel[]
  language: string
  stickyTop: number
  loading: boolean
}

const RegionSelector = ({ regions, language, stickyTop, loading }: RegionSelectorProps): ReactElement => {
  const [filterText, setFilterText] = useState<string>('')
  const { t } = useTranslation('landing')

  const resultRegions = filterSortRegions(regions, filterText, buildConfig().featureFlags.developerFriendly)

  const filteredRegions = filterSortRegions(regions, '', buildConfig().featureFlags.developerFriendly)
  const exampleRegion = regions.find(region => region.name === REGION_SEARCH_EXAMPLE) ?? filteredRegions[0]

  const firstLetterGroups = [...new Set(resultRegions.map(it => it.sortCategory))].map(group => (
    <RegionListGroup
      key={group}
      regions={resultRegions.filter(it => it.sortCategory === group)}
      title={group}
      stickyTop={stickyTop}
      languageCode={language}
      filterText={filterText}
    />
  ))
  const groups = [
    <NearbyRegions key='nearby' stickyTop={stickyTop} regions={regions} language={language} filterText={filterText} />,
    ...firstLetterGroups,
  ]

  return (
    <Stack maxWidth={640} paddingTop={4} gap={2}>
      <H1>{t('welcome', { appName: buildConfig().appName })}</H1>
      <Typography variant='body1'>{t('welcomeInformation')}</Typography>
      <SearchInput
        filterText={filterText}
        placeholderText={exampleRegion?.sortingName ?? REGION_SEARCH_EXAMPLE}
        onFilterTextChange={setFilterText}
        description={t('searchRegionDescription', { exampleRegion: exampleRegion?.name ?? REGION_SEARCH_EXAMPLE })}
      />
      {loading ? (
        <SkeletonList listItemHeight={40} />
      ) : (
        <Stack>
          <Typography variant='subtitle1' aria-live={resultRegions.length === 0 ? 'assertive' : 'polite'}>
            {t('search:searchResultsCount', { count: resultRegions.length })}
          </Typography>
          <List items={groups} NoItemsMessage='search:nothingFound' />
        </Stack>
      )}
    </Stack>
  )
}

export default RegionSelector
