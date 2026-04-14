import React, { ReactElement } from 'react'
import { StyleSheet, View } from 'react-native'
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
  iconPlaceholder: {
    width: 40,
  },
})

const IconPlaceholder = () => <View style={styles.iconPlaceholder} />

type HeaderMenuItemProps = {
  title: string
  onPress: () => void
  icon?: string
}

const HeaderMenuItem = ({ onPress, title, icon }: HeaderMenuItemProps): ReactElement => {
  const theme = useTheme()
  return (
    <Menu.Item
      accessibilityLabel={title}
      leadingIcon={icon ?? IconPlaceholder}
      title={title}
      onPress={onPress}
      style={{
        backgroundColor: theme.dark ? theme.colors.surfaceVariant : theme.colors.surface,
      }}
      contentStyle={styles.menuItemContent}
      titleStyle={[styles.menuItemTitle, { color: theme.colors.onSurface, textAlign: contentAlignmentRTLText(title) }]}
    />
  )
}

export default HeaderMenuItem
