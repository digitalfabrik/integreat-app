import React, { ReactElement } from 'react'
import { Menu } from 'react-native-paper'

export type HeaderMenuItemConfig = {
  key: string
  title: string
  icon: string
  onPress: () => void
  disabled?: boolean
}

type HeaderMenuItemProps = Omit<HeaderMenuItemConfig, 'key'> & {
  closeMenu: () => void
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
