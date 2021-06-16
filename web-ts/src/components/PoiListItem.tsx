import React, { ReactElement } from 'react'
import ListItem from './ListItem'
import { PoiModel } from 'api-client'

type PropsType = {
  poi: PoiModel
}

const PoiListItem = ({ poi }: PropsType): ReactElement => (
  <ListItem key={poi.path} title={poi.title} path={poi.path}>
    {poi.location.location && <div>{poi.location.location}</div>}
  </ListItem>
)

export default PoiListItem
