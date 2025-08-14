import Divider from '@mui/material/Divider'
import MuiList from '@mui/material/List'
import React, { ReactElement } from 'react'

import { join } from '../../utils'

type ListProps<T> = {
  header?: ReactElement
  items: T[]
  renderItem: (item: T) => ReactElement
}

const List = <T,>({ header, items, renderItem }: ListProps<T>): ReactElement => (
  <MuiList>
    {header}
    {join(items.map(renderItem), <Divider />)}
  </MuiList>
)

export default List
