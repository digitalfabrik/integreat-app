import Divider from '@mui/material/Divider'
import React, { ReactElement } from 'react'

export const join = <T, U>(items: T[], separator: (index: number) => U): (T | U)[] =>
  items.flatMap((item, index) => [item, separator(index)]).slice(0, -1)

export const withDividers = (items: ReactElement[]): ReactElement[] => join(items, index => <Divider key={index} />)
