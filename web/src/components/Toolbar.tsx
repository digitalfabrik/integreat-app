import Stack from '@mui/material/Stack'
import React, { ReactElement, ReactNode } from 'react'

import dimensions from '../constants/dimensions'

type ToolbarProps = {
  children?: ReactNode
  className?: string
  direction: 'column' | 'row'
}

const Toolbar = ({ children, className, direction }: ToolbarProps): ReactElement => (
  <Stack
    direction={direction}
    width={direction === 'column' ? dimensions.toolbarWidth : '100%'}
    className={className}
    overflow='hidden'>
    {children}
  </Stack>
)

export default Toolbar
