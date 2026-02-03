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

  if (innerText) {
    return (
      <Button
        mode='outlined'
        compact
        icon={icon}
        onPress={onPress}
        textColor={theme.colors.primary}
        style={[styles.button, { borderColor: theme.colors.primary }]}>
        {innerText}
      </Button>
    )
  }

  return (
    <Appbar.Action
      disabled={!visible}
      icon={icon}
      onPress={visible ? onPress : () => undefined}
      color={theme.colors.primary}
      accessibilityLabel={t(title)}
      style={[styles.appbarAction, { borderColor: theme.colors.primary, display: visible ? 'flex' : 'none' }]}
    />
  )
}

export default HeaderActionItem
