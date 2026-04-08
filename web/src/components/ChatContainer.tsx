import AddCommentOutlinedIcon from '@mui/icons-material/AddCommentOutlined'
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined'
import { dialogContentClasses } from '@mui/material/DialogContent'
import Fab from '@mui/material/Fab'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'

import { getChatName, CHAT_QUERY_KEY, parseQueryParams, toQueryParams } from 'shared'
import { CityModel } from 'shared/api'

import buildConfig from '../constants/buildConfig'
import useDimensions from '../hooks/useDimensions'
import useLocalStorage from '../hooks/useLocalStorage'
import useLockedBody from '../hooks/useLockedBody'
import ChatController, { LOCAL_STORAGE_ITEM_CHAT_MESSAGES } from './ChatController'
import ChatMenu from './ChatMenu'
import HeaderLanguageSelectorItem from './HeaderLanguageSelectorItem'
import { LanguageChangePath } from './LanguageList'
import MenuItem from './MenuItem'
import { TtsContext } from './TtsContainer'
import Dialog from './base/Dialog'

const ChatButtonContainer = styled('div')<{ bottom: number }>`
  position: fixed;
  bottom: ${props => props.bottom}px;
  inset-inline-end: 16px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: min-content;
  gap: 8px;
`

const StyledDialog = styled(Dialog)({
  [`.${dialogContentClasses.root}`]: {
    padding: '0 0 16px',
  },
})

type ChatContainerProps = {
  city: CityModel
  languageCode: string
  languageChangePaths: LanguageChangePath[] | null
}

const ChatContainer = ({ city, languageCode, languageChangePaths }: ChatContainerProps): ReactElement | null => {
  const [queryParams, setQueryParams] = useSearchParams()
  const chatVisible = parseQueryParams(queryParams).chat ?? false
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const { desktop, xsmall, visibleFooterHeight, bottomNavigationHeight } = useDimensions()
  const { visible: ttsPlayerVisible } = useContext(TtsContext)
  const { t } = useTranslation('chat')
  const chatName = getChatName(buildConfig().appName)
  useLockedBody(chatVisible)

  const { value: chatId, updateLocalStorageItem: updateChatId } = useLocalStorage<string | null>({
    key: `${LOCAL_STORAGE_ITEM_CHAT_MESSAGES}-${city.code}`,
    initialValue: null,
  })

  const resetChatId = () => {
    updateChatId(null)
    setConfirmDialogOpen(false)
  }

  const hideChatButton = xsmall && ttsPlayerVisible

  const open = () => {
    const newQueryParams = queryParams
    newQueryParams.set(CHAT_QUERY_KEY, 'true')
    setQueryParams(newQueryParams)
  }

  const close = () => {
    const newQueryParams = queryParams
    newQueryParams.delete(CHAT_QUERY_KEY)
    setQueryParams(newQueryParams)
  }

  if (hideChatButton) {
    return null
  }

  if (chatVisible) {
    const chatQuery = toQueryParams({ chat: true }).toString()
    const chatLanguageChangePaths =
      languageChangePaths?.map(({ path, ...rest }) => ({
        ...rest,
        path: path ? `${path}?${chatQuery}` : null,
      })) ?? []
    return (
      <StyledDialog
        title={chatName}
        close={close}
        actions={[
          ...(languageChangePaths
            ? [
                <HeaderLanguageSelectorItem
                  key='languageChange'
                  languageChangePaths={chatLanguageChangePaths}
                  languageCode={languageCode}
                />,
              ]
            : []),
          <ChatMenu
            key='chatMenu'
            confirmNewChatOpen={confirmDialogOpen}
            onConfirmClose={() => setConfirmDialogOpen(false)}
            onConfirmNewChat={resetChatId}>
            <MenuItem
              text={t('newChat')}
              icon={<AddCommentOutlinedIcon fontSize='small' />}
              disabled={chatId === null}
              onClick={() => setConfirmDialogOpen(true)}
            />
          </ChatMenu>,
        ]}>
        <ChatController chatId={chatId} updateChatId={updateChatId} city={city} languageCode={languageCode} />
      </StyledDialog>
    )
  }

  return (
    <ChatButtonContainer bottom={bottomNavigationHeight ?? visibleFooterHeight}>
      <Fab onClick={open} color='primary' aria-label={chatName}>
        <QuestionAnswerOutlinedIcon fontSize='large' />
      </Fab>
      {desktop && (
        <Typography textAlign='center' aria-hidden>
          {chatName}
        </Typography>
      )}
    </ChatButtonContainer>
  )
}

export default ChatContainer
