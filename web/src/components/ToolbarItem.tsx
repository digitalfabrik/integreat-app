import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'

import dimensions from '../constants/dimensions'
import useDimensions from '../hooks/useDimensions'
import Link from './base/Link'

const StyledButton = styled(ListItemButton)({
  flexDirection: 'column',
  padding: 8,
  width: dimensions.toolbarWidth,
}) as typeof ListItemButton

export type ToolbarItemProps = {
  icon: ReactElement
  text: string
  disabled?: boolean
  tooltip?: string | null
} & ({ to: string; onClick?: never } | { to?: never; onClick: () => void })

const ToolbarItem = ({ to, text, icon, disabled = false, tooltip, onClick }: ToolbarItemProps): ReactElement => {
  const { mobile } = useDimensions()
  const tooltipPlacement = mobile ? 'top' : 'right'

  return (
    <Tooltip title={tooltip} placement={tooltipPlacement}>
      <ListItem disablePadding>
        <StyledButton component={to ? Link : ListItemButton} onClick={onClick} to={to} disabled={disabled}>
          {icon}
          <ListItemText
            disableTypography
            primary={
              <Typography component='div' variant='label2' textAlign='center'>
                {text}
              </Typography>
            }
          />
        </StyledButton>
      </ListItem>
    </Tooltip>
  )
}

export default ToolbarItem
