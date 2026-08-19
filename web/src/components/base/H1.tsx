import Typography, { TypographyProps } from '@mui/material/Typography'
import React, { ReactElement } from 'react'

import useDimensions from '../../hooks/useDimensions'

const H1 = ({ children, ...props }: TypographyProps): ReactElement => {
  const { mobile } = useDimensions()
  return (
    <Typography
      variant='h1'
      {...props}
      sx={[
        {
          marginBlock: mobile ? 2 : 3,
        },
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
      ]}>
      {children}
    </Typography>
  )
}

export default H1
