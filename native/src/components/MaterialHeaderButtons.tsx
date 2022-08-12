import React, { ReactElement, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import {
  defaultOnOverflowMenuPress,
  HeaderButton,
  HeaderButtons,
  OnOverflowMenuPressParams,
  OverflowMenu,
} from 'react-navigation-header-buttons'

import { ThemeType } from 'build-configs'

const MaterialHeaderButton = (props: {
  disabled: boolean
  title: string
  onPress: () => void
  getButtonElement: () => ReactNode
}) => <HeaderButton {...props} IconComponent={MaterialIcon} iconSize={23} color='black' />

// Adjust cancel label for ios overflow menu of HeaderButtons
const onOverflowMenuPress = (cancelButtonLabel: string) => (props: OnOverflowMenuPressParams) =>
  defaultOnOverflowMenuPress({
    ...props,
    cancelButtonLabel,
  })

const MaterialHeaderButtons = (props: {
  cancelLabel: string
  items: Array<ReactNode>
  overflowItems: Array<ReactNode>
  theme: ThemeType
}): ReactElement => {
  const { cancelLabel, theme, items, overflowItems } = props
  const { t } = useTranslation('common')
  return (
    <HeaderButtons HeaderButtonComponent={MaterialHeaderButton}>
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

export default MaterialHeaderButtons
