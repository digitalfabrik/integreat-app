import React, { ComponentType, ReactElement, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  defaultOnOverflowMenuPress,
  HeaderButton,
  HeaderButtonProps,
  HeaderButtons,
  OnOverflowMenuPressParams,
  OverflowMenu,
  VisibleButtonProps,
} from 'react-navigation-header-buttons'
import styled from 'styled-components/native'

import { LanguageIcon, MenuIcon, SearchIcon } from '../assets'
import Icon from './base/Icon'

const StyledHeaderContainer = styled.View`
  margin: 0 10px;
`

type IconPropType = VisibleButtonProps['IconComponent'] extends ComponentType<infer T> | undefined ? T : never

const HeaderIcon = ({ name, ...props }: IconPropType): ReactElement => {
  if (!['language', 'search'].includes(name)) {
    throw new Error('Invalid icon name!')
  }
  return <Icon Icon={name === 'search' ? SearchIcon : LanguageIcon} {...props} />
}

const CustomHeaderButton = (props: HeaderButtonProps) => (
  <HeaderButton {...props} IconComponent={HeaderIcon} iconSize={23} color='black' />
)

// Adjust cancel label for ios overflow menu of HeaderButtons
const onOverflowMenuPress = (cancelButtonLabel: string) => (props: OnOverflowMenuPressParams) =>
  defaultOnOverflowMenuPress({
    ...props,
    cancelButtonLabel,
  })

const CustomHeaderButtons = (props: {
  cancelLabel: string
  items: Array<ReactNode>
  overflowItems: Array<ReactNode>
}): ReactElement => {
  const { cancelLabel, items, overflowItems } = props
  const { t } = useTranslation('common')
  return (
    <StyledHeaderContainer>
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        {items}
        <OverflowMenu
          onPress={onOverflowMenuPress(cancelLabel)}
          accessibilityLabel={t('moreOptions')}
          OverflowIcon={<Icon Icon={MenuIcon} />}>
          {overflowItems}
        </OverflowMenu>
      </HeaderButtons>
    </StyledHeaderContainer>
  )
}

export default CustomHeaderButtons
