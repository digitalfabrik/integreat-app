import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'

import Link from './base/Link'

const StyledButton = styled(Button)`
  background-color: ${props => props.theme.palette.tertiary.light};
  padding: 2px 12px;
`

const StyledIconButton = styled(IconButton)`
  background-color: ${props => props.theme.palette.tertiary.light};
`

type HeaderActionItemLinkProps = {
  text: string
  icon: ReactElement
  innerText?: string
} & ({ to: string; onClick?: never } | { to?: never; onClick: () => void })

const HeaderActionItem = ({ to, text, icon, onClick, innerText }: HeaderActionItemLinkProps): ReactElement => {
  const Button = innerText ? (
    <StyledButton onClick={onClick} startIcon={icon} aria-label={text}>
      {innerText}
    </StyledButton>
  ) : (
    <StyledIconButton onClick={onClick} color='primary' aria-label={text}>
      {icon}
    </StyledIconButton>
  )

  return (
    <Tooltip title={text}>
      {to ? (
        <Link to={to} aria-label={text}>
          {Button}
        </Link>
      ) : (
        Button
      )}
    </Tooltip>
  )
}

export default HeaderActionItem
