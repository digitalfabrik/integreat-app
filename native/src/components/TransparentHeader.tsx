import React, { ReactElement, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Share } from 'react-native'
import { Menu } from 'react-native-paper'
import styled, { useTheme } from 'styled-components/native'

import { SHARE_SIGNAL_NAME } from 'shared'

import { NavigationProps, RouteProps, RoutesType } from '../constants/NavigationTypes'
import buildConfig from '../constants/buildConfig'
import dimensions from '../constants/dimensions'
import useSnackbar from '../hooks/useSnackbar'
import openExternalUrl from '../utils/openExternalUrl'
import sendTrackingSignal from '../utils/sendTrackingSignal'
import { reportError } from '../utils/sentry'
import HeaderBox from './HeaderBox'
import HeaderMenu from './HeaderMenu'

const Horizontal = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const Container = styled.View`
  background-color: ${props => props.theme.colors.surface};
  height: ${dimensions.modalHeaderHeight}px;
  overflow: hidden;
`

type TransparentHeaderProps = {
  route: RouteProps<RoutesType>
  navigation: NavigationProps<RoutesType>
}

const TransparentHeader = ({ navigation, route }: TransparentHeaderProps): ReactElement | null => {
  const { t } = useTranslation('layout')
  const showSnackbar = useSnackbar()
  const [visible, setVisible] = useState(false)

  const shareUrl = (route.params as { shareUrl: string } | undefined)?.shareUrl
  const isPdfUrl = shareUrl?.toLowerCase().includes('.pdf')
  const theme = useTheme()

  const onShare = useCallback(async (): Promise<void> => {
    if (!shareUrl) {
      // The share option should only be shown if there is a shareUrl
      return
    }

    const message = t('shareMessage', {
      message: shareUrl,
      interpolation: {
        escapeValue: false,
      },
    })
    sendTrackingSignal({
      signal: {
        name: SHARE_SIGNAL_NAME,
        url: shareUrl,
      },
    })

    try {
      await Share.share({
        message,
        title: buildConfig().appName,
      })
    } catch (e) {
      showSnackbar({ text: 'generalError' })
      reportError(e)
    }
  }, [showSnackbar, shareUrl, t])

  const onOpenPdf = useCallback(async (): Promise<void> => {
    if (!shareUrl) {
      return
    }
    await openExternalUrl(shareUrl, showSnackbar)
  }, [showSnackbar, shareUrl])

  const renderMenuItem = (title: string, onPress: () => void) => (
    <Menu.Item
      key={title}
      title={t(title)}
      onPress={onPress}
      style={{ backgroundColor: theme.dark ? theme.colors.surfaceVariant : theme.colors.surface }}
    />
  )

  const overflowItems = shareUrl
    ? [renderMenuItem('share', onShare), ...(isPdfUrl ? [renderMenuItem('openExternal', onOpenPdf)] : [])]
    : []

  if (!navigation.canGoBack()) {
    return null
  }

  return (
    <Container testID='transparent-header'>
      <Horizontal>
        <HeaderBox goBack={navigation.goBack} />
        <HeaderMenu
          visible={visible}
          setVisible={setVisible}
          menuItems={overflowItems}
          renderMenuItem={renderMenuItem}
          showDefaultSections={false}
        />
      </Horizontal>
    </Container>
  )
}

export default TransparentHeader
