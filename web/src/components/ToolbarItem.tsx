import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import StyledSmallViewTip from './StyledSmallViewTip'
import StyledToolbarItem from './StyledToolbarItem'
import Tooltip from './Tooltip'
import Button from './base/Button'
import Icon from './base/Icon'

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
  isDisabled?: boolean
} & ItemProps

const ToolbarItem = ({ href, text, icon, isDisabled = false, onClick }: ToolbarItemProps): ReactElement => {
  const { t } = useTranslation('categories')
  const styledToolbarItem = (
    <StyledToolbarItem
      as={onClick ? Button : undefined}
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
    <Tooltip text={t('disabledPdf')} flow='up'>
      {styledToolbarItem}
    </Tooltip>
  ) : (
    <>{styledToolbarItem}</>
  )
}

export default ToolbarItem
