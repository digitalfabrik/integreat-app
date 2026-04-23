import shouldForwardProp from '@emotion/is-prop-valid'
import ListSubheader from '@mui/material/ListSubheader'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'

import { RegionModel } from 'shared/api'

import RegionListItem from './RegionListItem'

export const RegionGroupHeader = styled(ListSubheader, { shouldForwardProp })<{
  stickyTop: number
}>(({ stickyTop }) => ({
  top: stickyTop,
  transition: 'top 0.2s ease-out',
}))

type RegionListGroupProps = {
  title: string
  regions: RegionModel[]
  stickyTop: number
  languageCode: string
  filterText: string
}

const RegionListGroup = ({
  title,
  regions,
  stickyTop,
  filterText,
  languageCode,
}: RegionListGroupProps): ReactElement => (
  <Stack paddingBlock={1}>
    <RegionGroupHeader stickyTop={stickyTop}>{title}</RegionGroupHeader>
    {regions.map(region => (
      <RegionListItem key={region.code} region={region} language={languageCode} filterText={filterText} />
    ))}
  </Stack>
)

export default RegionListGroup
