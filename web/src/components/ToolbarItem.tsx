import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import dimensions from '../constants/dimensions'
import { spacesToDashes } from '../utils/stringUtils'
import CleanAnchor from './CleanAnchor'
import StyledSmallViewTip from './StyledSmallViewTip'
import Button from './base/Button'
import Icon from './base/Icon'
import Tooltip from './base/Tooltip'

const StyledToolbarItem = styled(CleanAnchor)<{ disabled?: boolean }>`
  display: inline-block;
  padding: 8px;

  && {
    cursor: ${props => (props.disabled ? 'default' : 'pointer')};
  }

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

type ItemProps =
  | {
      onClick: () => void
      href?: undefined
    }
  | {
      onClick?: undefined
      href: string
    }

type ToolbarItemProps = {
  icon: string
  text: string
  id?: string
  isDisabled?: boolean
} & ItemProps

const ToolbarItem = ({ href, text, icon, isDisabled = false, onClick, id }: ToolbarItemProps): ReactElement => {
  const { t } = useTranslation('categories')
  const toolTipId = spacesToDashes(text)
  const styledToolbarItem = (
    <StyledToolbarItem
      as={onClick ? Button : undefined}
      id={id}
      // @ts-expect-error wrong types from polymorphic 'as', see https://github.com/styled-components/styled-components/issues/4112
      href={isDisabled ? null : href}
      onClick={isDisabled ? null : onClick}
      label={text}
      disabled={isDisabled}>
      <StyledIcon src={icon} disabled={isDisabled} />
      <StyledSmallViewTip>{text}</StyledSmallViewTip>
    </StyledToolbarItem>
  )
  return isDisabled ? (
    <Tooltip id={toolTipId} tooltipContent={t('disabledPdf')}>
      {styledToolbarItem}
    </Tooltip>
  ) : (
    <>{styledToolbarItem}</>
  )
}

export default ToolbarItem
