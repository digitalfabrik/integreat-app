import { css, SerializedStyles, Theme } from '@emotion/react'
import styled from '@emotion/styled'
import { SvgIconProps } from '@mui/material/SvgIcon'
import Tooltip from '@mui/material/Tooltip'
import React, { ElementType, ReactElement } from 'react'

import useWindowDimensions from '../hooks/useWindowDimensions'
import StyledSmallViewTip from './StyledSmallViewTip'
import Button from './base/Button'
import Icon from './base/Icon'
import Link from './base/Link'

const toolbarItemStyle = ({ theme }: { theme: Theme }): SerializedStyles => css`
  display: inline-block;
  padding: 8px;
  border: none;
  color: ${theme.legacy.colors.textColor};
  background-color: transparent;
  text-align: center;

  ${theme.breakpoints.down('md')} {
    line-height: 1.15;
  }
`

const ToolbarItemLink = styled(Link)`
  ${toolbarItemStyle}
`
const ToolbarItemButton = styled(Button)`
  ${toolbarItemStyle}
`

const DisabledToolbarItem = styled('div')`
  ${toolbarItemStyle};
  color: ${props => props.theme.legacy.colors.textDisabledColor};
  cursor: default;
`

const StyledIcon = styled(Icon)<{ disabled?: boolean }>`
  color: ${props =>
    props.disabled ? props.theme.legacy.colors.textDisabledColor : props.theme.legacy.colors.textSecondaryColor};
`

type ItemProps =
  | {
      onClick: () => void
      to?: undefined
    }
  | {
      onClick?: undefined
      to: string
    }

type ToolbarItemProps = {
  icon: string | ElementType<SvgIconProps>
  text: string
  isDisabled?: boolean
  tooltip?: string | null
} & ItemProps

const ToolbarItem = ({ to, text, icon, isDisabled = false, tooltip, onClick }: ToolbarItemProps): ReactElement => {
  const { viewportSmall } = useWindowDimensions()
  const tooltipPlacement = viewportSmall ? 'top' : 'right'
  const Content = (
    <>
      <StyledIcon src={icon} disabled={isDisabled} />
      <StyledSmallViewTip>{text}</StyledSmallViewTip>
    </>
  )

  if (isDisabled) {
    return (
      <Tooltip title={tooltip} placement={tooltipPlacement} arrow>
        <DisabledToolbarItem aria-label={text}>{Content}</DisabledToolbarItem>
      </Tooltip>
    )
  }

  return (
    <Tooltip title={tooltip} placement={tooltipPlacement}>
      {onClick ? (
        <ToolbarItemButton onClick={onClick} label={text}>
          {Content}
        </ToolbarItemButton>
      ) : (
        <ToolbarItemLink to={to} aria-label={text}>
          {Content}
        </ToolbarItemLink>
      )}
    </Tooltip>
  )
}

export default ToolbarItem
