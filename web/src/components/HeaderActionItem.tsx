import MuiButton from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'

import Link from './base/Link'

const StyledButton = styled(MuiButton)`
  padding: 2px 12px;
  border: 1px solid;
` as typeof MuiButton

const StyledIconButton = styled(IconButton)`
  border: 1px solid;
` as typeof IconButton

type HeaderActionItemLinkProps = {
  text: string
  icon: ReactElement
  innerText?: string
} & ({ to: string; onClick?: never } | { to?: never; onClick: () => void })

const HeaderActionItem = ({ to, text, icon, onClick, innerText }: HeaderActionItemLinkProps): ReactElement => {
  if (innerText) {
    return (
      <Tooltip title={text}>
        <StyledButton
          variant='outlined'
          component={to ? Link : MuiButton}
          to={to}
          onClick={onClick}
          startIcon={icon}
          aria-label={text}>
          {innerText}
        </StyledButton>
      </Tooltip>
    )
  }

  return (
    <Tooltip title={text}>
      <StyledIconButton component={to ? Link : IconButton} to={to} onClick={onClick} color='primary' aria-label={text}>
        {icon}
      </StyledIconButton>
    </Tooltip>
  )
}

export default HeaderActionItem
