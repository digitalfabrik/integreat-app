import Typography from '@mui/material/Typography'
import React, { ReactElement } from 'react'

import useDimensions from '../../hooks/useDimensions'

type H1Props = {
  children: string
}

const H1 = ({ children }: H1Props): ReactElement => {
  const { mobile } = useDimensions()
  return (
    <Typography variant='h1' marginBlock={mobile ? 1 : 3}>
      {children}
    </Typography>
  )
}

export default H1
