import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'
import { Appbar, Button, useTheme } from 'react-native-paper'

type HeaderActionItemProps = {
  title: string
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
  title,
  iconName,
  visible = true,
  onPress,
  innerText,
}: HeaderActionItemProps): ReactElement => {
  const theme = useTheme()
  const { t } = useTranslation('layout')
  const icon = iconName === 'search' ? 'magnify' : 'translate'
  const color = theme.dark ? theme.colors.primaryContainer : theme.colors.primary

  if (innerText) {
    return (
      <Button
        mode='outlined'
        compact
        icon={icon}
        onPress={onPress}
        accessibilityLabel={t(title)}
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
      accessibilityLabel={t(title)}
      style={[styles.appbarAction, { borderColor: color, display: visible ? 'flex' : 'none' }]}
    />
  )
}

export default HeaderActionItem
