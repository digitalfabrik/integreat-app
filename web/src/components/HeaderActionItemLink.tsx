import { useTheme } from '@emotion/react'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import React, { ReactElement } from 'react'

import Link from './base/Link'

type HeaderActionItemLinkProps = {
  to: string
  text: string
  icon: ReactElement
}

const HeaderActionItemLink = ({ to, text, icon }: HeaderActionItemLinkProps): ReactElement => {
  const theme = useTheme()

  return (
    <Tooltip title={text}>
      <Link to={to} ariaLabel={text}>
        <IconButton
          name={text}
          color='primary'
          sx={{ backgroundColor: theme.palette.tertiary.light }}
          size='medium'
          aria-label={text}>
          {icon}
        </IconButton>
      </Link>
    </Tooltip>
  )
}

export default HeaderActionItemLink
