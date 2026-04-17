import React, { ReactElement, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Menu } from 'react-native-paper'
import styled, { useTheme } from 'styled-components/native'

import { NavigationProps, RouteProps, RoutesType } from '../constants/NavigationTypes'
import dimensions from '../constants/dimensions'
import useSnackbar from '../hooks/useSnackbar'
import openExternalUrl from '../utils/openExternalUrl'
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
  const [menuVisible, setMenuVisible] = useState(false)
  const theme = useTheme()

  const shareUrl = (route.params as { shareUrl: string } | undefined)?.shareUrl
  const isPdfUrl = shareUrl?.toLowerCase().includes('.pdf')

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

  const menuItems = isPdfUrl ? [renderMenuItem('openExternal', onOpenPdf)] : []

  if (!navigation.canGoBack()) {
    return null
  }

  return (
    <Container testID='transparent-header'>
      <Horizontal>
        <HeaderBox goBack={navigation.goBack} />
        <HeaderMenu
          navigation={navigation}
          shareUrl={shareUrl}
          visible={menuVisible}
          setVisible={setMenuVisible}
          menuItems={menuItems}
        />
      </Horizontal>
    </Container>
  )
}

export default TransparentHeader
