import React, { ReactElement, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Share } from 'react-native'
import { HiddenItem } from 'react-navigation-header-buttons'
import styled, { useTheme } from 'styled-components/native'

import { SHARE_SIGNAL_NAME } from 'shared'

import { NavigationProps, RouteProps, RoutesType } from '../constants/NavigationTypes'
import buildConfig from '../constants/buildConfig'
import dimensions from '../constants/dimensions'
import useSnackbar from '../hooks/useSnackbar'
import openExternalUrl from '../utils/openExternalUrl'
import sendTrackingSignal from '../utils/sendTrackingSignal'
import { reportError } from '../utils/sentry'
import CustomHeaderButtons from './CustomHeaderButtons'
import HeaderBox from './HeaderBox'

const Horizontal = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const Container = styled.View`
  background-color: ${props => props.theme.legacy.colors.backgroundAccentColor};
  height: ${dimensions.modalHeaderHeight}px;
`

type TransparentHeaderProps = {
  route: RouteProps<RoutesType>
  navigation: NavigationProps<RoutesType>
}

const TransparentHeader = ({ navigation, route }: TransparentHeaderProps): ReactElement | null => {
  const { t } = useTranslation('layout')
  const showSnackbar = useSnackbar()

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

  const overflowItems = shareUrl
    ? [
        <HiddenItem
          titleStyle={{ color: theme.legacy.colors.textColor }}
          style={{ backgroundColor: theme.legacy.colors.backgroundAccentColor }}
          key='share'
          title={t('share')}
          onPress={onShare}
          accessibilityLabel={t('share')}
        />,
        ...(isPdfUrl
          ? [
              <HiddenItem
                titleStyle={{ color: theme.legacy.colors.textColor }}
                style={{ backgroundColor: theme.legacy.colors.backgroundAccentColor }}
                key='openExternal'
                title={t('openExternal')}
                onPress={onOpenPdf}
                accessibilityLabel={t('openExternal')}
              />,
            ]
          : []),
      ]
    : []

  if (!navigation.canGoBack()) {
    return null
  }

  return (
    <Container testID='transparent-header'>
      <Horizontal>
        <HeaderBox goBack={navigation.goBack} />
        <CustomHeaderButtons cancelLabel={t('cancel')} items={[]} overflowItems={overflowItems} />
      </Horizontal>
    </Container>
  )
}

export default TransparentHeader
