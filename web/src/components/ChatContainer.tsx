import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined'
import { dialogContentClasses } from '@mui/material/DialogContent'
import Fab from '@mui/material/Fab'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement, useContext } from 'react'
import { useSearchParams } from 'react-router'

import { getChatName, CHAT_QUERY_KEY, parseQueryParams, toQueryParams } from 'shared'
import { CityModel } from 'shared/api'

import buildConfig from '../constants/buildConfig'
import useDimensions from '../hooks/useDimensions'
import useLockedBody from '../hooks/useLockedBody'
import ChatController from './ChatController'
import HeaderLanguageSelectorItem from './HeaderLanguageSelectorItem'
import { LanguageChangePath } from './LanguageList'
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
  const { desktop, xsmall, visibleFooterHeight, bottomNavigationHeight } = useDimensions()
  const { visible: ttsPlayerVisible } = useContext(TtsContext)
  const chatName = getChatName(buildConfig().appName)
  useLockedBody(chatVisible)

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
        actions={
          languageChangePaths
            ? [
                <HeaderLanguageSelectorItem
                  key='languageChange'
                  languageChangePaths={chatLanguageChangePaths}
                  languageCode={languageCode}
                />,
              ]
            : null
        }>
        <ChatController city={city} languageCode={languageCode} />
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
