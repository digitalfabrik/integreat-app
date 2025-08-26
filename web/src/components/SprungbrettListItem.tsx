import { styled } from '@mui/material/styles'
import React, { memo, ReactElement } from 'react'

import { SprungbrettJobModel } from 'shared/api'

import { SprungbrettIcon } from '../assets'
import ListItem from './ListItem'

const Content = styled('div')`
  overflow-wrap: anywhere;
`

type SprungbrettListItemProps = {
  job: SprungbrettJobModel
}

const SprungbrettListItem = ({ job }: SprungbrettListItemProps): ReactElement => (
  <ListItem title={job.title} path={job.url} thumbnail={SprungbrettIcon} thumbnailSize={24}>
    <Content dir='auto'>{job.location}</Content>
  </ListItem>
)

export default memo(SprungbrettListItem)
