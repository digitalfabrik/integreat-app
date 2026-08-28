import React, { ReactElement } from 'react'
import { StyleSheet } from 'react-native'
import { Appbar, Button, useTheme } from 'react-native-paper'

type HeaderActionItemProps = {
  accessibilityLabel: string
  iconName: 'search' | 'language'
  visible?: boolean
  onPress?: () => void
  innerText?: string
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  appbarAction: {
    borderWidth: 1,
    borderRadius: 24,
    margin: 0,
    backgroundColor: 'transparent',
  },
})

const HeaderActionItem = ({
  accessibilityLabel,
  iconName,
  visible = true,
  onPress,
  innerText,
}: HeaderActionItemProps): ReactElement => {
  const theme = useTheme()
  const icon = iconName === 'search' ? 'magnify' : 'translate'
  const color = theme.dark ? theme.colors.primaryContainer : theme.colors.primary

  if (innerText) {
    return (
      <Button
        mode='outlined'
        compact
        icon={icon}
        onPress={onPress}
        accessibilityLabel={accessibilityLabel}
        textColor={color}
        style={[styles.button, { borderColor: color }]}>
        {innerText}
      </Button>
    )
  }

  return (
    <Appbar.Action
      disabled={!visible}
      icon={icon}
      onPress={visible ? onPress : () => undefined}
      color={color}
      accessibilityLabel={accessibilityLabel}
      style={[styles.appbarAction, { borderColor: color, display: visible ? 'flex' : 'none' }]}
    />
  )
}

export default HeaderActionItem
