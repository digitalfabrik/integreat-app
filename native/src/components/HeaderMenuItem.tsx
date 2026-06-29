import React, { ReactElement } from 'react'
import { Menu } from 'react-native-paper'

type HeaderMenuItemProps = {
  title: string
  onPress: () => void
  closeMenu: () => void
  icon: string
  disabled?: boolean
}

const HeaderMenuItem = ({ onPress, closeMenu, title, icon, disabled }: HeaderMenuItemProps): ReactElement => (
  <Menu.Item
    accessibilityLabel={title}
    leadingIcon={icon}
    disabled={disabled}
    title={title}
    onPress={() => {
      closeMenu()
      onPress()
    }}
  />
)

export default HeaderMenuItem
