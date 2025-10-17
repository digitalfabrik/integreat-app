import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { filterSortCities } from 'shared'
import { CityModel } from 'shared/api'

import buildConfig from '../constants/buildConfig'
import CityListGroup from './CityListGroup'
import NearbyCities from './NearbyCities'
import SearchInput from './SearchInput'
import H1 from './base/H1'
import List from './base/List'

export const CITY_SEARCH_PLACEHOLDER = 'München'

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
    <Stack maxWidth={640} paddingTop={4} gap={2}>
      <H1>{t('welcome', { appName: buildConfig().appName })}</H1>
      <Typography variant='body1'>{t('welcomeInformation')}</Typography>
      <SearchInput
        filterText={filterText}
        placeholderText={CITY_SEARCH_PLACEHOLDER}
        onFilterTextChange={setFilterText}
        description={t('searchCityDescription')}
      />
      <Stack>
        <Typography variant='subtitle1' aria-live={resultCities.length === 0 ? 'assertive' : 'polite'}>
          {t('search:searchResultsCount', { count: resultCities.length })}
        </Typography>
        <List items={groups} NoItemsMessage='search:nothingFound' />
      </Stack>
    </Stack>
  )
}

export default CitySelector
