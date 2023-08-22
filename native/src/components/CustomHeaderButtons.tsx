import React, { ComponentType, ReactElement, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import {
  defaultOnOverflowMenuPress,
  HeaderButton,
  HeaderButtonProps,
  HeaderButtons,
  OnOverflowMenuPressParams,
  OverflowMenu,
  VisibleButtonProps,
} from 'react-navigation-header-buttons'
import { useTheme } from 'styled-components'

import { LanguageIcon, SearchIcon } from '../assets'
import { isRTL } from '../constants/contentDirection'

type IconPropType = VisibleButtonProps['IconComponent'] extends ComponentType<infer T> | undefined ? T : never

const Icon = (props: IconPropType): ReactElement => {
  const { name } = props
  if (name === 'search') {
    return <SearchIcon {...props} />
  }
  if (name === 'language') {
    return <LanguageIcon scaleX={isRTL() ? -1 : 1} {...props} />
  }
  return <MaterialIcon {...props} name={name} />
}

const CustomHeaderButton = (props: HeaderButtonProps) => (
  <HeaderButton {...props} IconComponent={Icon} iconSize={23} color='black' />
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
  const theme = useTheme()
  const { t } = useTranslation('common')
  return (
    <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
      {items}

      <OverflowMenu
        onPress={onOverflowMenuPress(cancelLabel)}
        accessibilityLabel={t('moreOptions')}
        OverflowIcon={<MaterialIcon name='more-vert' size={23} color={theme.colors.textColor} />}>
        {overflowItems}
      </OverflowMenu>
    </HeaderButtons>
  )
}

export default CustomHeaderButtons
