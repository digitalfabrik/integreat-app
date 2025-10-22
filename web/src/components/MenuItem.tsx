import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import MuiMenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import { styled, useTheme } from '@mui/material/styles'
import React, { ReactElement } from 'react'

import { NEW_TAB, NEW_TAB_FEATURES } from '../utils/openLink'

const StyledMenuItem = styled(MuiMenuItem)({
  minHeight: 0,
}) as typeof MuiMenuItem

const TooltipContent = styled(Stack)({
  pointerEvents: 'auto',
})
type MenuListItemProps = {
  icon?: ReactElement
  iconEnd?: ReactElement
  text: string
  disabled?: boolean
  tooltip?: string | null
  closeMenu?: () => void
} & ({ to: string; onClick?: never } | { to?: never; onClick: () => void })

const MenuItem = ({
  to,
  text,
  icon,
  iconEnd,
  disabled = false,
  tooltip,
  onClick,
  closeMenu,
  ...otherProps
}: MenuListItemProps): ReactElement => {
  const { contentDirection } = useTheme()

  const handleClick = () => {
    closeMenu?.()
    onClick?.()
  }

  const Content = (
    <Tooltip title={tooltip}>
      <TooltipContent direction='row' width='100%'>
        {icon && <ListItemIcon>{icon}</ListItemIcon>}
        <ListItemText>{text}</ListItemText>
        {iconEnd}
      </TooltipContent>
    </Tooltip>
  )

  return (
    <StyledMenuItem
      // Use an <a> tag instead of the <Link> component to avoid the app crashing with error:
      // can't access property "tagName", button is null
      // Also, this breaks html semantics but there is currently no better workaround to achieve keyboard a11y
      // https://github.com/mui/material-ui/issues/33268
      component={to ? 'a' : MuiMenuItem}
      target={NEW_TAB}
      rel={NEW_TAB_FEATURES}
      href={to}
      onClick={handleClick}
      disabled={disabled}
      dir={contentDirection}
      {...otherProps}>
      {Content}
    </StyledMenuItem>
  )
}

export default MenuItem
