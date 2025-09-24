import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { filterSortCities } from 'shared'
import { CityModel } from 'shared/api'

import buildConfig from '../constants/buildConfig'
import CityListGroup from './CityListGroup'
import CrashTestingIcon from './CrashTestingIcon'
import NearbyCities from './NearbyCities'
import SearchInput from './SearchInput'
import List from './base/List'

type CitySelectorProps = {
  cities: CityModel[]
  language: string
  stickyTop: number
}

const CitySelector = ({ cities, language, stickyTop }: CitySelectorProps): ReactElement => {
  const [filterText, setFilterText] = useState<string>('')
  const { t } = useTranslation('landing')

  const resultCities = filterSortCities(cities, filterText, buildConfig().featureFlags.developerFriendly)
  const firstLetterGroups = [...new Set(resultCities.map(it => it.sortCategory))].map(group => (
    <CityListGroup
      key={group}
      cities={resultCities.filter(it => it.sortCategory === group)}
      title={group}
      stickyTop={stickyTop}
      languageCode={language}
      filterText={filterText}
    />
  ))
  const groups = [
    <NearbyCities key='nearby' stickyTop={stickyTop} cities={cities} language={language} filterText={filterText} />,
    ...firstLetterGroups,
  ]

  return (
    <Stack paddingTop={4}>
      <CrashTestingIcon />
      <SearchInput
        filterText={filterText}
        placeholderText={t('searchCity')}
        onFilterTextChange={setFilterText}
        spaceSearch={false}
        description={t('searchCityDescription')}
      />
      <Typography variant='label1' aria-live={resultCities.length === 0 ? 'assertive' : 'polite'}>
        {t('search:searchResultsCount', { count: resultCities.length })}
      </Typography>
      <List items={groups} NoItemsMessage='search:nothingFound' />
    </Stack>
  )
}

export default CitySelector
