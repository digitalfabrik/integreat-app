import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { filterSortCities } from 'shared'
import { CityModel } from 'shared/api'

import buildConfig from '../constants/buildConfig'
import CityEntry from './CityEntry'
import CrashTestingIcon from './CrashTestingIcon'
import Failure from './Failure'
import NearbyCities from './NearbyCities'
import ScrollingSearchBox from './ScrollingSearchBox'

const Container = styled('div')`
  padding-top: 22px;
`

export const CityListParent = styled(Typography)<{ stickyTop: number }>`
  position: sticky;
  top: ${props => props.stickyTop}px;
  height: 30px;
  margin-top: 10px;
  line-height: 30px;
  transition: top 0.2s ease-out;
  background-color: ${props => props.theme.legacy.colors.backgroundColor};
`

const SearchCounter = styled('p')`
  color: ${props => props.theme.legacy.colors.textSecondaryColor};
`

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
    <div key={group}>
      <CityListParent stickyTop={stickyTop}>{group}</CityListParent>
      {resultCities
        .filter(it => it.sortCategory === group)
        .map(city => (
          <React.Fragment key={city.code}>
            <Divider />
            <CityEntry city={city} language={language} filterText={filterText} />
          </React.Fragment>
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
        <SearchCounter aria-live={resultCities.length === 0 ? 'assertive' : 'polite'}>
          {t('search:searchResultsCount', { count: resultCities.length })}
        </SearchCounter>
        <NearbyCities stickyTop={stickyTop} cities={cities} language={language} filterText={filterText} />
        <Divider />
        {resultCities.length === 0 ? <Failure errorMessage='search:nothingFound' /> : groups}
      </ScrollingSearchBox>
    </Container>
  )
}

export default CitySelector
