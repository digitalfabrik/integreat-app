import React, { ReactElement, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  defaultOnOverflowMenuPress,
  HeaderButton,
  HeaderButtons,
  OnOverflowMenuPressParams,
  OverflowMenu,
} from 'react-navigation-header-buttons'

import { LanguageIcon, MenuIcon, SearchIcon } from '../assets'
import Icon from './base/Icon'

const HeaderIcon = ({ name, ...props }: { name: string }): ReactElement => (
  <Icon Icon={name === 'search' ? SearchIcon : LanguageIcon} {...props} />
)

const CustomHeaderButton = (props: {
  disabled: boolean
  title: string
  onPress: () => void
  getButtonElement: () => ReactNode
}) => <HeaderButton {...props} IconComponent={HeaderIcon} iconSize={24} color='black' />

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
    <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
      {items}
      <OverflowMenu
        onPress={onOverflowMenuPress(cancelLabel)}
        accessibilityLabel={t('moreOptions')}
        OverflowIcon={<Icon Icon={MenuIcon} />}>
        {overflowItems}
      </OverflowMenu>
    </HeaderButtons>
  )
}

export default CustomHeaderButtons
