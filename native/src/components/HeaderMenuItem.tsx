import React, { ReactElement } from 'react'
import { StyleSheet } from 'react-native'
import { Menu } from 'react-native-paper'
import { useTheme } from 'styled-components/native'

import { contentAlignmentRTLText } from '../constants/contentDirection'

const styles = StyleSheet.create({
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    paddingRight: 8,
  },
})

type HeaderMenuItemProps = {
  title: string
  onPress: () => void
  closeMenu: () => void
  icon: string
}

const HeaderMenuItem = ({ onPress, closeMenu, title, icon }: HeaderMenuItemProps): ReactElement => {
  const theme = useTheme()
  return (
    <Menu.Item
      accessibilityLabel={title}
      leadingIcon={icon}
      title={title}
      onPress={() => {
        closeMenu()
        onPress()
      }}
      style={{
        backgroundColor: theme.dark ? theme.colors.surfaceVariant : theme.colors.surface,
      }}
      contentStyle={styles.menuItemContent}
      titleStyle={[styles.menuItemTitle, { color: theme.colors.onSurface, textAlign: contentAlignmentRTLText(title) }]}
    />
  )
}

export default HeaderMenuItem
