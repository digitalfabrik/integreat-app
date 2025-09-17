import Stack from '@mui/material/Stack'
import React, { ReactElement, ReactNode } from 'react'

import dimensions from '../constants/dimensions'

type ToolbarProps = {
  children?: ReactNode
  className?: string
}

const Toolbar = ({ children, className }: ToolbarProps): ReactElement => (
  <Stack width={dimensions.toolbarWidth} className={className}>
    {children}
  </Stack>
)

export default Toolbar
