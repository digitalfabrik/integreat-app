import Typography, { TypographyProps } from '@mui/material/Typography'
import React, { ReactElement } from 'react'

import useDimensions from '../../hooks/useDimensions'

const H1 = ({ children, ...props }: TypographyProps): ReactElement => {
  const { mobile } = useDimensions()
  return (
    <Typography variant='h1' marginBlock={mobile ? 1 : 3} {...props}>
      {children}
    </Typography>
  )
}

export default H1
