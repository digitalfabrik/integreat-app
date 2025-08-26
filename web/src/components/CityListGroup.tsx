import shouldForwardProp from '@emotion/is-prop-valid'
import ListSubheader from '@mui/material/ListSubheader'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'

import { CityModel } from 'shared/api'

import CityEntry from './CityEntry'

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
  <>
    <CityGroupHeader stickyTop={stickyTop}>{title}</CityGroupHeader>
    {cities.map(city => (
      <CityEntry key={city.code} city={city} language={languageCode} filterText={filterText} />
    ))}
  </>
)

export default CityListGroup
