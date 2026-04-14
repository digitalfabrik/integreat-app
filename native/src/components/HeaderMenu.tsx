import React, { cloneElement, ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Share } from 'react-native'
import { IconButton, Menu, useTheme } from 'react-native-paper'

import { SETTINGS_ROUTE } from 'shared'

import { NavigationProps, RoutesType } from '../constants/NavigationTypes'
import buildConfig from '../constants/buildConfig'
import useSnackbar from '../hooks/useSnackbar'
import { withDividers } from '../utils'
import { reportError } from '../utils/sentry'
import HeaderMenuItem from './HeaderMenuItem'

type HeaderMenuProps = {
  navigation: NavigationProps<RoutesType>
  visible: boolean
  setVisible: (visible: boolean) => void
  menuItems: ReactElement[]
  shareUrl?: string
  pageTitle?: string | null
}

const HeaderMenu = ({
  navigation,
  menuItems = [],
  shareUrl,
  pageTitle,
  visible,
  setVisible,
}: HeaderMenuProps): ReactElement | null => {
  const theme = useTheme()
  const { t } = useTranslation('layout')
  const showSnackbar = useSnackbar()

  const share = async () => {
    if (!shareUrl) {
      return
    }

    const title = pageTitle ?? buildConfig().appName
    const message = t('shareMessage', {
      message: `${title}\n${shareUrl}`,
      interpolation: {
        escapeValue: false,
      },
    })

    try {
      await Share.share({ message, title })
    } catch (e) {
      showSnackbar({ text: 'generalError' })
      reportError(e)
    }
  }

  const items = [
    ...menuItems,
    ...(shareUrl ? [<HeaderMenuItem key='share' title={t('share')} onPress={share} icon='share-variant' />] : []),
    <HeaderMenuItem
      key='settings'
      title={t('settings')}
      onPress={() => navigation.navigate(SETTINGS_ROUTE)}
      icon='cog-outline'
    />,
  ].map((element: ReactElement<{ onPress?: () => void }>) =>
    // Close header menu on item press
    cloneElement(element, {
      onPress: () => {
        element.props.onPress?.()
        setVisible(false)
      },
    }),
  )

  if (items.length === 0) {
    return null
  }

  return (
    <Menu
      // Menu component closes and fails to open again on re-render
      // https://github.com/callstack/react-native-paper/issues/4763#issuecomment-3427895632
      key={Number(visible)}
      visible={visible}
      onDismiss={() => setVisible(false)}
      overlayAccessibilityLabel={t('common:close')}
      style={{
        width: 232,
      }}
      contentStyle={{
        borderRadius: 16,
        backgroundColor: theme.dark ? theme.colors.surfaceVariant : theme.colors.surface,
      }}
      anchorPosition='bottom'
      anchor={
        <IconButton
          icon='dots-vertical'
          iconColor={theme.colors.onSurface}
          onPress={() => setVisible(!visible)}
          accessibilityLabel={t('settings')}
          testID='header-overflow-menu-button'
        />
      }>
      {withDividers(items)}
    </Menu>
  )
}

export default HeaderMenu
