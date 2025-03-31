import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import dimensions from '../constants/dimensions'
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

  @media ${dimensions.smallViewport} {
    line-height: 1.15;
  }
`

const StyledIcon = styled(Icon)<{ disabled?: boolean }>`
  color: ${props => (props.disabled ? props.theme.colors.textDisabledColor : props.theme.colors.textSecondaryColor)};
`

const StyledTooltip = styled(Tooltip)`
  max-width: 250px;
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
  icon: string
  text: string
  id?: string
  isDisabled?: boolean
} & ItemProps

const ToolbarItem = ({ to, text, icon, isDisabled = false, onClick, id }: ToolbarItemProps): ReactElement => {
  const { t } = useTranslation('categories')
  const toolTipId = spacesToDashes(text)

  if (isDisabled) {
    return (
      <StyledTooltip id={toolTipId} tooltipContent={t('disabledPdf')}>
        {/* @ts-expect-error wrong types from polymorphic 'as', see https://github.com/styled-components/styled-components/issues/4112 */}
        <StyledToolbarItem as='div' id={id} label={text} disabled>
          <StyledIcon src={icon} disabled />
          <StyledSmallViewTip>{text}</StyledSmallViewTip>
        </StyledToolbarItem>
      </StyledTooltip>
    )
  }

  return (
    <StyledToolbarItem
      as={onClick ? Button : undefined}
      id={id}
      // @ts-expect-error wrong types from polymorphic 'as', see https://github.com/styled-components/styled-components/issues/4112
      to={to}
      onClick={onClick}
      label={text}
      disabled={false}>
      <StyledIcon src={icon} disabled={false} />
      <StyledSmallViewTip>{text}</StyledSmallViewTip>
    </StyledToolbarItem>
  )
}

export default ToolbarItem
