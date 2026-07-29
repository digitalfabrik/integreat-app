import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Popper from '@mui/material/Popper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import useLocalStorage, { CHAT_HIGHLIGHT_POPUP_VISIBLE_STORAGE_KEY } from '../hooks/useLocalStorage'
import { ChatLogoAvatar } from './ChatAvatar'

const POPUP_OFFSET = -8
const AVATAR_SIZE = 24

const StyledPopper = styled(Popper)`
  z-index: ${props => props.theme.zIndex.fab};
`

const StyledPaper = styled(Paper)`
  max-width: 224px;
  margin-bottom: 16px;
  border-radius: 16px;
  filter: drop-shadow(0 2px 4px rgb(0 0 0 / 24%));

  @keyframes appear {
    from {
      opacity: 0;
      transform: scale(0.5);
    }

    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  animation: appear 200ms ease-out;

  &::before {
    content: '';
    position: absolute;
    bottom: -16px;
    ${props => (props.theme.contentDirection === 'rtl' ? 'inset-inline-start: 16px' : 'inset-inline-end: 16px')};
    width: 16px;
    height: 16px;
    background: inherit;
    clip-path: polygon(0 0, 80% 100%, 100% 0);
  }
`

type ChatHighlightPopupProps = {
  anchorEl: HTMLElement | null
  chatName: string
}

const ChatHighlightPopup = ({ anchorEl, chatName }: ChatHighlightPopupProps): ReactElement => {
  const { t } = useTranslation('chat')
  const [visible, setVisible] = useLocalStorage<boolean>({
    key: CHAT_HIGHLIGHT_POPUP_VISIBLE_STORAGE_KEY,
    initialValue: true,
  })

  return (
    <StyledPopper
      open={visible && Boolean(anchorEl)}
      anchorEl={anchorEl}
      placement='top-end'
      modifiers={[{ name: 'offset', options: { offset: [POPUP_OFFSET, 4] } }]}>
      <StyledPaper elevation={2}>
        <Stack padding={2} gap={1}>
          <Stack direction='row' alignItems='center' gap={1}>
            <ChatLogoAvatar size={AVATAR_SIZE} />
            <Typography variant='body2' flex={1}>
              {t('welcomeGreeting')} 👋
            </Typography>
            <IconButton onClick={() => setVisible(false)} size='small' aria-label={t('common:close')}>
              <CloseIcon fontSize='small' />
            </IconButton>
          </Stack>
          <Typography variant='body2'>
            <Trans i18nKey='chat:welcomeText' values={{ name: chatName }} components={{ strong: <strong /> }} />
          </Typography>
        </Stack>
      </StyledPaper>
    </StyledPopper>
  )
}

export default ChatHighlightPopup
