import Divider from '@mui/material/Divider'
import MuiList from '@mui/material/List'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { filterSortCities } from 'shared'
import { CityModel } from 'shared/api'

import buildConfig from '../constants/buildConfig'
import { withDividers } from '../utils'
import CityListGroup from './CityListGroup'
import CrashTestingIcon from './CrashTestingIcon'
import Failure from './Failure'
import NearbyCities from './NearbyCities'
import ScrollingSearchBox from './ScrollingSearchBox'

type CitySelectorProps = {
  cities: CityModel[]
  language: string
}

const CitySelector = ({ cities, language }: CitySelectorProps): ReactElement => {
  const [filterText, setFilterText] = useState<string>('')
  const [stickyTop, setStickyTop] = useState<number>(0)
  const { t } = useTranslation('landing')

  const resultCities = filterSortCities(cities, filterText, buildConfig().featureFlags.developerFriendly)

  const groups = [...new Set(resultCities.map(it => it.sortCategory))].map(group => (
    <CityListGroup
      key={group}
      cities={resultCities.filter(it => it.sortCategory === group)}
      title={group}
      stickyTop={stickyTop}
      languageCode={language}
      filterText={filterText}
    />
  ))

  return (
    <Stack paddingTop={4}>
      <CrashTestingIcon />
      <ScrollingSearchBox
        filterText={filterText}
        onFilterTextChange={setFilterText}
        placeholderText={t('searchCity')}
        spaceSearch={false}
        onStickyTopChanged={setStickyTop}>
        <Typography variant='label1' aria-live={resultCities.length === 0 ? 'assertive' : 'polite'}>
          {t('search:searchResultsCount', { count: resultCities.length })}
        </Typography>
        <MuiList>
          <NearbyCities stickyTop={stickyTop} cities={cities} language={language} filterText={filterText} />
          <Divider />
          {resultCities.length > 0 ? withDividers(groups) : <Failure errorMessage='search:nothingFound' />}
        </MuiList>
      </ScrollingSearchBox>
    </Stack>
  )
}

export default CitySelector
