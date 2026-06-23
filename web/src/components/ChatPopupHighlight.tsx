import CloseIcon from '@mui/icons-material/Close'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Popper from '@mui/material/Popper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import buildConfig from '../constants/buildConfig'
import useLocalStorage, { CHAT_POPUP_HIGHLIGHT_VISIBLE_STORAGE_KEY } from '../hooks/useLocalStorage'
import Svg from './base/Svg'

const POPUP_OFFSET = -24
const AVATAR_SIZE = 24

const StyledPopper = styled(Popper)`
  z-index: ${props => props.theme.zIndex.tooltip};
`

const StyledAvatar = styled(Avatar)`
  width: ${AVATAR_SIZE}px;
  height: ${AVATAR_SIZE}px;
  background-color: ${props => props.theme.palette.tertiary.dark};
`

const CenteredSvg = styled(Svg)`
  & svg {
    display: block;
  }
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
    inset-inline-end: 16px;
    width: 16px;
    height: 16px;
    background: inherit;
    clip-path: polygon(0 0, 80% 100%, 100% 0);
  }
`

type ChatPopupHighlightProps = {
  anchorEl: HTMLElement | null
  chatName: string
}

const ChatPopupHighlight = ({ anchorEl, chatName }: ChatPopupHighlightProps): ReactElement => {
  const { t } = useTranslation('chat')
  const { icons } = buildConfig()
  const [visible, setVisible] = useLocalStorage<boolean>({
    key: CHAT_POPUP_HIGHLIGHT_VISIBLE_STORAGE_KEY,
    initialValue: true,
  })

  return (
    <StyledPopper
      open={visible && Boolean(anchorEl)}
      anchorEl={anchorEl}
      placement='top-end'
      modifiers={[{ name: 'offset', options: { offset: [POPUP_OFFSET, 0] } }]}>
      <StyledPaper elevation={2}>
        <Stack padding={2} gap={1}>
          <Stack direction='row' alignItems='center' gap={1}>
            {icons.appLogoMobileInverted && (
              <StyledAvatar>
                <CenteredSvg
                  src={icons.appLogoMobileInverted}
                  width={AVATAR_SIZE}
                  height={AVATAR_SIZE}
                  overrideFillColors='white'
                />
              </StyledAvatar>
            )}
            <Typography variant='body2' flex={1}>
              {t('welcomeGreeting')}
            </Typography>
            <IconButton
              onClick={() => setVisible(false)}
              size='small'
              aria-label={t('common:close')}
              sx={{ mt: -1, mr: -1 }}>
              <CloseIcon fontSize='small' />
            </IconButton>
          </Stack>
          <Typography variant='body2'>
            <Trans i18nKey='chat:welcomeText' values={{ chatName }} components={{ strong: <strong /> }} />
          </Typography>
        </Stack>
      </StyledPaper>
    </StyledPopper>
  )
}

export default ChatPopupHighlight
