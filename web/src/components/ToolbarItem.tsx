import { css, SerializedStyles, Theme, useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import { SvgIconProps } from '@mui/material/SvgIcon'
import React, { ElementType, ReactElement } from 'react'
import { PlacesType } from 'react-tooltip'

import useWindowDimensions from '../hooks/useWindowDimensions'
import { spacesToDashes } from '../utils/stringUtils'
import StyledSmallViewTip from './StyledSmallViewTip'
import Button from './base/Button'
import Icon from './base/Icon'
import Link from './base/Link'
import Tooltip from './base/Tooltip'

const toolbarItemStyle = ({ theme }: { theme: Theme }): SerializedStyles => css`
  display: inline-block;
  padding: 8px;
  border: none;
  color: ${theme.colors.textColor};
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
  color: ${props => props.theme.colors.textDisabledColor};
  cursor: default;
`

const StyledIcon = styled(Icon)<{ disabled?: boolean }>`
  color: ${props => (props.disabled ? props.theme.colors.textDisabledColor : props.theme.colors.textSecondaryColor)};
`

const StyledTooltip = styled(Tooltip)`
  max-width: 250px;
`

type AdditionalTooltipProps = {
  isOpen: boolean
  openOnClick: boolean
}

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
  id?: string
  isDisabled?: boolean
  tooltip?: string | null
  additionalTooltipProps?: AdditionalTooltipProps
} & ItemProps

const ToolbarItem = ({
  to,
  text,
  icon,
  isDisabled = false,
  tooltip,
  additionalTooltipProps,
  onClick,
  id,
}: ToolbarItemProps): ReactElement => {
  const theme = useTheme()
  const { viewportSmall } = useWindowDimensions()
  const tooltipDirectionForDesktop: PlacesType = theme.contentDirection === 'ltr' ? 'right' : 'left'
  const tooltipDirection: PlacesType = viewportSmall ? 'top' : tooltipDirectionForDesktop
  const tooltipId = id ?? spacesToDashes(text)

  const Content = (
    <>
      <StyledIcon src={icon} disabled={isDisabled} />
      <StyledSmallViewTip>{text}</StyledSmallViewTip>
    </>
  )

  if (isDisabled) {
    return (
      <StyledTooltip id={tooltipId} tooltipContent={tooltip} place={tooltipDirection} {...additionalTooltipProps}>
        <DisabledToolbarItem aria-label={text}>{Content}</DisabledToolbarItem>
      </StyledTooltip>
    )
  }

  return (
    <StyledTooltip id={tooltipId} tooltipContent={tooltip} place={tooltipDirection} {...additionalTooltipProps}>
      {onClick ? (
        <ToolbarItemButton onClick={onClick} label={text}>
          {Content}
        </ToolbarItemButton>
      ) : (
        <ToolbarItemLink to={to} aria-label={text}>
          {Content}
        </ToolbarItemLink>
      )}
    </StyledTooltip>
  )
}

export default ToolbarItem
