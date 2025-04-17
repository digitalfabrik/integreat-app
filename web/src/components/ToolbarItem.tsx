import React, { ReactElement } from 'react'
import { PlacesType } from 'react-tooltip'
import styled, { useTheme } from 'styled-components'

import dimensions from '../constants/dimensions'
import { useContrastTheme } from '../hooks/useContrastTheme'
import useWindowDimensions from '../hooks/useWindowDimensions'
import { spacesToDashes } from '../utils/stringUtils'
import StyledSmallViewTip from './StyledSmallViewTip'
import Button from './base/Button'
import Icon from './base/Icon'
import Link from './base/Link'
import Tooltip from './base/Tooltip'

const StyledToolbarItem = styled(Link)<{ disabled?: boolean }>`
  display: inline-block;
  padding: 8px;
  border: none;
  color: ${props => (props.disabled ? props.theme.colors.textDisabledColor : props.theme.colors.textColor)};
  background-color: transparent;
  text-align: center;
  ${props => props.disabled && 'cursor: default;'}

  @media ${dimensions.smallViewport} {
    line-height: 1.15;
  }
`

const StyledIcon = styled(Icon)<{ disabled?: boolean; $isContrastTheme: boolean }>`
  color: ${props => {
    if (props.disabled) {
      return props.theme.colors.textDisabledColor
    }
    if (props.$isContrastTheme) {
      return props.theme.colors.textColor
    }
    return props.theme.colors.textSecondaryColor
  }};
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
  icon: string
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
  const { isContrastTheme } = useContrastTheme()
  const { viewportSmall } = useWindowDimensions()
  const tooltipDirectionForDesktop: PlacesType = theme.contentDirection === 'ltr' ? 'right' : 'left'
  const tooltipDirection: PlacesType = viewportSmall ? 'top' : tooltipDirectionForDesktop
  const tooltipId = id ?? spacesToDashes(text)

  if (isDisabled) {
    return (
      <StyledTooltip id={tooltipId} tooltipContent={tooltip} place={tooltipDirection} {...additionalTooltipProps}>
        {/* @ts-expect-error wrong types from polymorphic 'as', see https://github.com/styled-components/styled-components/issues/4112 */}
        <StyledToolbarItem as='div' label={text} disabled>
          <StyledIcon $isContrastTheme={isContrastTheme} src={icon} disabled />
          <StyledSmallViewTip>{text}</StyledSmallViewTip>
        </StyledToolbarItem>
      </StyledTooltip>
    )
  }
  return (
    <StyledTooltip id={tooltipId} tooltipContent={tooltip} place={tooltipDirection} {...additionalTooltipProps}>
      <StyledToolbarItem
        as={onClick ? Button : undefined}
        // @ts-expect-error wrong types from polymorphic 'as', see https://github.com/styled-components/styled-components/issues/4112
        to={to}
        onClick={onClick}
        label={text}
        disabled={false}>
        <StyledIcon src={icon} $isContrastTheme={isContrastTheme} disabled={false} />
        <StyledSmallViewTip>{text}</StyledSmallViewTip>
      </StyledToolbarItem>
    </StyledTooltip>
  )
}

export default ToolbarItem
