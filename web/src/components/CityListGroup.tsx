import shouldForwardProp from '@emotion/is-prop-valid'
import ListSubheader from '@mui/material/ListSubheader'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'

import { CityModel } from 'shared/api'

import CityListItem from './CityListItem'

export const CityGroupHeader = styled(ListSubheader, { shouldForwardProp })<{
  stickyTop: number
}>(({ stickyTop }) => ({
  top: stickyTop,
  transition: 'top 0.2s ease-out',
}))

type CityListGroupProps = {
  title: string
  cities: CityModel[]
  stickyTop: number
  languageCode: string
  filterText: string
}

const CityListGroup = ({ title, cities, stickyTop, filterText, languageCode }: CityListGroupProps): ReactElement => (
  <Stack paddingBlock={1}>
    <CityGroupHeader stickyTop={stickyTop}>{title}</CityGroupHeader>
    {cities.map(city => (
      <CityListItem key={city.code} city={city} language={languageCode} filterText={filterText} />
    ))}
  </Stack>
)

export default CityListGroup
