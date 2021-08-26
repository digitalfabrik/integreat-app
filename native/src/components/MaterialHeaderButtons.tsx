import React, { ReactElement, ReactNode } from 'react'
import {
  defaultOnOverflowMenuPress,
  HeaderButton,
  HeaderButtons,
  OnOverflowMenuPressParams,
  OverflowMenu
} from 'react-navigation-header-buttons'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { ThemeType } from 'build-configs'

const MaterialHeaderButton = (props: {
  disabled: boolean
  title: string
  onPress: () => void
  getButtonElement: () => React.ReactElement<any>
}) => <HeaderButton {...props} IconComponent={MaterialIcon} iconSize={23} color='black' disabled={true} />

// Adjust cancel label for ios overflow menu of HeaderButtons
const onOverflowMenuPress = (cancelButtonLabel: string) => (props: OnOverflowMenuPressParams) =>
  defaultOnOverflowMenuPress({
    ...props,
    cancelButtonLabel
  })

const MaterialHeaderButtons = (props: {
  cancelLabel: string
  items: Array<ReactNode>
  overflowItems: Array<ReactNode>
  theme: ThemeType
}): ReactElement => {
  const { cancelLabel, theme, items, overflowItems } = props
  return (
    <HeaderButtons HeaderButtonComponent={MaterialHeaderButton}>
      {items}
      <OverflowMenu
        onPress={onOverflowMenuPress(cancelLabel)}
        OverflowIcon={<MaterialIcon name='more-vert' size={23} color={theme.colors.textColor} />}>
        {overflowItems}
      </OverflowMenu>
    </HeaderButtons>
  )
}

export default MaterialHeaderButtons
