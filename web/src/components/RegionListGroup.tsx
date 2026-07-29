import Stack from '@mui/material/Stack'
import React, { ReactElement } from 'react'

import { RegionModel } from 'shared/api'

import useDimensions from '../hooks/useDimensions'
import RegionListItem from './RegionListItem'
import { StickyListSubheader } from './base/List'

type RegionListGroupProps = {
  title: string
  regions: RegionModel[]
  languageCode: string
  filterText: string
}

const RegionListGroup = ({ title, regions, filterText, languageCode }: RegionListGroupProps): ReactElement => {
  const { stickyTop } = useDimensions()
  return (
    <Stack paddingBlock={1}>
      <StickyListSubheader stickyTop={stickyTop}>{title}</StickyListSubheader>
      {regions.map(region => (
        <RegionListItem key={region.code} region={region} language={languageCode} filterText={filterText} />
      ))}
    </Stack>
  )
}

export default RegionListGroup
