import React, { ReactElement } from 'react'

import { PoiModel } from 'api-client'

import ListItem from './ListItem'

type PropsType = {
  poi: PoiModel
}

const PoiListItem = ({ poi }: PropsType): ReactElement => (
  <ListItem key={poi.path} title={poi.title} path={poi.path}>
    {poi.location.location && <div>{poi.location.location}</div>}
  </ListItem>
)

export default PoiListItem
