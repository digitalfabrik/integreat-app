import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import Popper from '@mui/material/Popper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import useLocalStorage, { CHAT_HIGHLIGHT_POPUP_VISIBLE_STORAGE_KEY } from '../hooks/useLocalStorage'
import { ChatLogoAvatar } from './ChatAvatar'
import PopoverPaper from './base/PopoverPaper'

const POPUP_OFFSET = -8
const AVATAR_SIZE = 24

const StyledPopper = styled(Popper)`
  z-index: ${props => props.theme.zIndex.fab};
`

const StyledPaper = styled(PopoverPaper)`
  width: max-content;
  max-width: 224px;
  margin-bottom: 16px;
  filter: drop-shadow(0 2px 4px rgb(0 0 0 / 24%));
`

type ChatHighlightPopupProps = {
  anchorEl: HTMLElement | null
  chatName: string
}

const ChatHighlightPopup = ({ anchorEl, chatName }: ChatHighlightPopupProps): ReactElement => {
  const { t } = useTranslation()
  const { contentDirection } = useTheme()
  const [visible, setVisible] = useLocalStorage<boolean>({
    key: CHAT_HIGHLIGHT_POPUP_VISIBLE_STORAGE_KEY,
    initialValue: true,
  })

  return (
    <StyledPopper
      open={visible && Boolean(anchorEl)}
      anchorEl={anchorEl}
      placement='top-end'
      disablePortal
      modifiers={[{ name: 'offset', options: { offset: [POPUP_OFFSET, 4] } }]}>
      <StyledPaper elevation={2} arrowPosition='top' arrowAlignment={contentDirection === 'rtl' ? 'left' : 'right'}>
        <Stack sx={{ padding: 2, gap: 1 }}>
          <Stack direction='row' sx={{ alignItems: 'center', gap: 1 }}>
            <ChatLogoAvatar size={AVATAR_SIZE} />
            <Typography variant='body2' sx={{ flex: 1 }}>
              {t($ => $.chat.welcome.title)} 👋
            </Typography>
            <IconButton onClick={() => setVisible(false)} size='small' aria-label={t($ => $.common.actions.close)}>
              <CloseIcon fontSize='small' />
            </IconButton>
          </Stack>
          <Typography variant='body2'>
            <Trans ns='chat' i18nKey={$ => $.chat.welcome.description} values={{ name: chatName }} />
          </Typography>
        </Stack>
      </StyledPaper>
    </StyledPopper>
  )
}

export default ChatHighlightPopup
