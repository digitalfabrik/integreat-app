import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined'
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined'
import Badge from '@mui/material/Badge'
import Fab from '@mui/material/Fab'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { CHAT_QUERY_KEY, getChatName, PLACES_ROUTE } from 'shared'

import buildConfig from '../constants/buildConfig'
import { CHAT_FAB_ELEMENT_ID } from '../constants/layout'
import { TtsContext } from '../contexts/TtsContext'
import { useScrollDimensions } from '../hooks/useDimensions'
import useQueryParam from '../hooks/useQueryParam'
import useRegionContentParams from '../hooks/useRegionContentParams'
import { log } from '../utils/sentry'
import ChatHighlightPopup from './ChatHighlightPopup'
import LiveAnnouncer from './LiveAnnouncer'
import ToolChoicePopup from './ToolChoicePopup'

const FabContainer = styled(Stack)<{ bottom: number }>(({ theme, bottom }) => ({
  position: 'fixed',
  zIndex: theme.zIndex.fab,
  bottom,
  insetInlineEnd: 32,
  marginBottom: 24,
  alignItems: 'center',
  gap: 8,
}))

type ToolsFabProps = {
  chatEnabled: boolean
  bescheidCheckEnabled: boolean
  unreadMessageCount: number
}

const ToolsFab = ({ chatEnabled, bescheidCheckEnabled, unreadMessageCount }: ToolsFabProps): ReactElement | null => {
  const [, setChatOpen] = useQueryParam(CHAT_QUERY_KEY)
  const [toolChoiceOpen, setToolChoiceOpen] = useState(false)
  const [fabAnchor, setFabAnchor] = useState<HTMLButtonElement | null>(null)
  const { desktop, visibleFooterHeight, bottomNavigationHeight, xsmall } = useScrollDimensions()
  const { visible: ttsPlayerVisible } = useContext(TtsContext)
  const { route } = useRegionContentParams()
  const { t } = useTranslation()

  if (!chatEnabled) {
    if (bescheidCheckEnabled) {
      log('To use the bescheid-check you also need to enable the chat', 'error')
    }
    return null
  }

  if (route === PLACES_ROUTE || (xsmall && ttsPlayerVisible)) {
    return null
  }

  const chatName = getChatName(buildConfig().appName)
  const digitalAssistantName = t($ => $.common.labels.assistant.title)
  const unreadMessages = t($ => $.chat.unread, { count: unreadMessageCount })
  const chatBadge = unreadMessageCount > 0 ? unreadMessageCount : undefined

  return (
    <FabContainer id={CHAT_FAB_ELEMENT_ID} bottom={bottomNavigationHeight ?? visibleFooterHeight}>
      <LiveAnnouncer message={unreadMessageCount > 0 ? unreadMessages : ''} />
      <Badge badgeContent={chatBadge} color='error' aria-label={unreadMessages}>
        {bescheidCheckEnabled ? (
          <Fab
            ref={setFabAnchor}
            onClick={() => setToolChoiceOpen(true)}
            variant='extended'
            color='primary'
            sx={{ gap: 1 }}>
            <AutoAwesomeOutlinedIcon fontSize='large' />
            {digitalAssistantName}
          </Fab>
        ) : (
          <Fab ref={setFabAnchor} onClick={() => setChatOpen(true)} color='primary' aria-label={chatName}>
            <QuestionAnswerOutlinedIcon fontSize='large' />
          </Fab>
        )}
      </Badge>
      <ChatHighlightPopup anchorEl={fabAnchor} chatName={chatName} />
      {desktop && !bescheidCheckEnabled && (
        <Typography aria-hidden sx={{ textAlign: 'center', width: 'min-content' }}>
          {chatName}
        </Typography>
      )}
      <ToolChoicePopup
        anchorEl={toolChoiceOpen ? fabAnchor : null}
        close={() => setToolChoiceOpen(false)}
        chatBadge={chatBadge}
      />
    </FabContainer>
  )
}

export default ToolsFab
