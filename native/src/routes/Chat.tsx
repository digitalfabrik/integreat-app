import { useNetInfo } from '@react-native-community/netinfo'
import { useFocusEffect } from '@react-navigation/native'
import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'react-native-paper'

import { ChatRouteType, uuid } from 'shared'
import { createChatMessagesEndpoint, ErrorCode, loadFromEndpoint, useLoadFromEndpoint } from 'shared/api'

import Failure from '../components/Failure'
import HeaderMenu from '../components/HeaderMenu'
import HeaderMenuItem from '../components/HeaderMenuItem'
import ProgressSpinner from '../components/ProgressSpinner'
import QrCodeModal from '../components/QrCodeModal'
import WebView from '../components/WebView'
import AlertDialog from '../components/base/AlertDialog'
import Text from '../components/base/Text'
import { NavigationProps, RouteProps } from '../constants/NavigationTypes'
import useHeader from '../hooks/useHeader'
import useLoadRegionContent from '../hooks/useLoadRegionContent'
import useRegionAppContext from '../hooks/useRegionAppContext'
import { determineApiUrl } from '../utils/helpers'
import { captureError } from '../utils/sentry'
import { getChatUrl } from '../utils/url'

type ChatProps = {
  route: RouteProps<ChatRouteType>
  navigation: NavigationProps<ChatRouteType>
}

const Chat = ({ route, navigation }: ChatProps): ReactElement => {
  const [menuVisible, setMenuVisible] = useState(false)
  const [newChatConfirmationVisible, setNewChatConfirmationVisible] = useState(false)
  const [qrModalVisible, setQrModalVisible] = useState(false)
  const { isConnected } = useNetInfo()
  const { regionCode, languageCode, settings, updateChatSettings } = useRegionAppContext()
  const { data } = useLoadRegionContent({ regionCode, languageCode })
  const { t } = useTranslation('chat')

  const chatSettings = settings.chat[regionCode]
  const chatId = chatSettings?.id ?? ''

  const chatResponse = useLoadFromEndpoint(createChatMessagesEndpoint, determineApiUrl, {
    regionCode,
    languageCode,
    chatId,
  })

  const chatUrl = getChatUrl({ regionCode, languageCode, chatId })
  const availableLanguages = data?.languages.map(it => it.code)

  useEffect(() => {
    if (!chatSettings) {
      updateChatSettings({ seenMessages: 0, id: uuid() })
    }
  }, [chatSettings, updateChatSettings])

  useFocusEffect(
    useCallback(
      () => () =>
        loadFromEndpoint(createChatMessagesEndpoint, determineApiUrl, { regionCode, languageCode, chatId })
          .then(({ messages }) =>
            updateChatSettings({ seenMessages: messages.filter(message => !message.userIsAuthor).length }),
          )
          .catch(captureError),
      [chatId, regionCode, languageCode, updateChatSettings],
    ),
  )

  const openMenu = (visible: boolean) => {
    setMenuVisible(visible)
    if (visible) {
      chatResponse.refresh()
    }
  }

  const menuItems = [
    <HeaderMenuItem
      key='newChat'
      title={t('newChat')}
      onPress={() => {
        setMenuVisible(false)
        setNewChatConfirmationVisible(true)
      }}
      closeMenu={() => setNewChatConfirmationVisible(false)}
      icon='comment-plus-outline'
    />,
    <HeaderMenuItem
      key='consultationQr'
      title={t('consultationQrCodeTitle')}
      disabled={!chatResponse.data}
      onPress={() => {
        setMenuVisible(false)
        setQrModalVisible(true)
      }}
      closeMenu={() => setQrModalVisible(false)}
      icon='qrcode'
    />,
  ]

  const menu = (
    <HeaderMenu
      navigation={navigation}
      visible={menuVisible}
      setVisible={openMenu}
      menuItems={menuItems}
      pageTitle={null}
    />
  )

  useHeader({ navigation, route, data, availableLanguages, menu })

  if (isConnected === false) {
    return <Failure code={ErrorCode.NetworkConnectionFailed} retry={null} />
  }

  if (!chatSettings) {
    return <ProgressSpinner />
  }

  const createNewChat = () => {
    updateChatSettings({ seenMessages: 0, id: uuid() })
    setNewChatConfirmationVisible(false)
  }

  return (
    <>
      <WebView source={{ uri: chatUrl }} />
      <AlertDialog
        visible={newChatConfirmationVisible}
        close={() => setNewChatConfirmationVisible(false)}
        title={t('newChat')}
        actions={[
          <Button key='cancel' onPress={() => setNewChatConfirmationVisible(false)} mode='outlined' style={{ flex: 1 }}>
            {t('layout:cancel')}
          </Button>,
          <Button key='confirm' onPress={createNewChat} mode='contained' style={{ flex: 3 }}>
            {t('newChat')}
          </Button>,
        ]}>
        <Text>{t('newChatConfirmation')}</Text>
      </AlertDialog>
      {!!chatResponse.data && (
        <QrCodeModal
          modalVisible={qrModalVisible}
          closeModal={() => setQrModalVisible(false)}
          title={t('consultationQrCodeTitle')}
          description={t('consultationQrCodeDescription')}
          content={chatResponse.data.ticketUrl}
        />
      )}
    </>
  )
}

export default Chat
