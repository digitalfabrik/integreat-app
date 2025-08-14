import shouldForwardProp from '@emotion/is-prop-valid'
import Divider from '@mui/material/Divider'
import MuiList from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListSubheader from '@mui/material/ListSubheader'
import { styled } from '@mui/material/styles'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { filterSortCities } from 'shared'
import { CityModel } from 'shared/api'

import buildConfig from '../constants/buildConfig'
import { join } from '../utils'
import CityEntry from './CityEntry'
import CrashTestingIcon from './CrashTestingIcon'
import Failure from './Failure'
import NearbyCities from './NearbyCities'
import ScrollingSearchBox from './ScrollingSearchBox'
import List from './base/List'

const Container = styled('div')`
  padding-top: 22px;
`

export const StyledListSubheader = styled(ListSubheader, { shouldForwardProp })<{ stickyTop: number }>`
  top: ${props => props.stickyTop}px;
  transition: top 0.2s ease-out;
`

export const StyledListItem = styled(ListItem)`
  flex-direction: column;
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
    <StyledListItem key={group} alignItems='flex-start'>
      <List
        header={<StyledListSubheader stickyTop={stickyTop}>{group}</StyledListSubheader>}
        items={resultCities.filter(it => it.sortCategory === group)}
        renderItem={city => <CityEntry key={city.code} city={city} language={language} filterText={filterText} />}
      />
    </StyledListItem>
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
        <MuiList>
          <NearbyCities stickyTop={stickyTop} cities={cities} language={language} filterText={filterText} />
          <Divider />
          {resultCities.length === 0 ? <Failure errorMessage='search:nothingFound' /> : join(groups, <Divider />)}
        </MuiList>
      </ScrollingSearchBox>
    </Container>
  )
}

export default CitySelector
