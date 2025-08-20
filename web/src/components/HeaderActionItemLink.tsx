import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { useTheme } from '@mui/material/styles'
import React, { ReactElement } from 'react'

import Link from './base/Link'

type HeaderActionItemLinkProps = {
  text: string
  icon: ReactElement
} & ({ to: string; onClick?: never } | { to?: never; onClick: () => void })

const HeaderActionItemLink = ({ to, text, icon, onClick }: HeaderActionItemLinkProps): ReactElement => {
  const theme = useTheme()

  return (
    <Tooltip id={id} place={tooltipDirection} tooltipContent={text}>
      <Link to={to ?? ''} ariaLabel={text} id={id} onClick={onClick}>
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
