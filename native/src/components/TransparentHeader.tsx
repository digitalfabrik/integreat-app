import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Menu } from 'react-native-paper'
import styled, { useTheme } from 'styled-components/native'

import { NavigationProps, RouteProps, RoutesType } from '../constants/NavigationTypes'
import dimensions from '../constants/dimensions'
import useOpenExternalUrl from '../utils/openExternalUrl'
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
  const { t } = useTranslation(['layout'])
  const openExternalUrl = useOpenExternalUrl()
  const [menuVisible, setMenuVisible] = useState(false)
  const theme = useTheme()

  const shareUrl = (route.params as { shareUrl: string } | undefined)?.shareUrl
  const isPdfUrl = shareUrl?.toLowerCase().includes('.pdf')

  const menuItems = isPdfUrl
    ? [
        <Menu.Item
          key={t($ => $.openExternal)}
          title={t($ => $.openExternal)}
          onPress={shareUrl ? () => openExternalUrl(shareUrl) : undefined}
          style={{ backgroundColor: theme.dark ? theme.colors.surfaceVariant : theme.colors.surface }}
        />,
      ]
    : []

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
