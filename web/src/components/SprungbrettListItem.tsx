import * as React from 'react'
import { memo, ReactElement } from 'react'
import styled from 'styled-components'

import { SprungbrettJobModel } from 'api-client'

import ListItem from './ListItem'

const Content = styled.div`
  overflow-wrap: anywhere;
`

type SprungbrettListItemProps = {
  job: SprungbrettJobModel
}

const SprungbrettListItem = ({ job }: SprungbrettListItemProps): ReactElement => (
  <ListItem title={job.title} path={job.url}>
    <Content dir='auto'>{job.location}</Content>
  </ListItem>
)

export default memo(SprungbrettListItem)
