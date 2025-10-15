import CloseIcon from '@mui/icons-material/Close'
import FastForwardIcon from '@mui/icons-material/FastForward'
import FastRewindIcon from '@mui/icons-material/FastRewind'
import PauseIcon from '@mui/icons-material/Pause'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import useDimensions from '../hooks/useDimensions'

export const TTS_PLAYER_ELEMENT_ID = 'tts-player'

const StyledTtsPlayer = styled('dialog')<{ bottom: number }>`
  background-color: ${props => props.theme.palette.background.accent};
  color: ${props => props.theme.palette.text.primary};
  border-radius: 8px;
  width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 32px 24px 24px;
  position: fixed;
  margin-bottom: 12px;
  bottom: ${props => props.bottom}px;
  gap: 16px;
  border-color: transparent;

  /* Position tts player above bottom sheet */
  z-index: 10;
`

const StyledPanel = styled('div')`
  display: flex;
  align-items: center;
  gap: 20px;
`

const PlayButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  transition:
    box-shadow 0.2s ease,
    transform 0.1s ease;
  width: 48px;
  height: 48px;
  border-radius: 48px;
`

const StyledIconButton = styled(IconButton)`
  display: flex;
  gap: 4px;
  align-items: center;
`

const HeaderText = styled(Typography)`
  display: inline-block;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  align-self: center;
  max-width: 100%;
`

const CloseIconButton = styled(IconButton)`
  top: 0;
  right: 0;
  position: absolute;
`

type TtsPlayerProps = {
  isPlaying: boolean
  disabled: boolean
  playPrevious: () => void
  playNext: () => void
  close: () => void
  title: string
  play: () => void
  pause: () => void
}

const TtsPlayer = ({
  isPlaying,
  playPrevious,
  playNext,
  close,
  title,
  play,
  pause,
  disabled,
}: TtsPlayerProps): ReactElement => {
  const { visibleFooterHeight, bottomNavigationHeight } = useDimensions()
  const { t } = useTranslation('layout')

  return (
    <StyledTtsPlayer id={TTS_PLAYER_ELEMENT_ID} bottom={bottomNavigationHeight ?? visibleFooterHeight}>
      <CloseIconButton onClick={close} aria-label={t('common:close')}>
        <CloseIcon />
      </CloseIconButton>
      <HeaderText variant='title1'>{title}</HeaderText>
      {/* Sound player panel shouldn't be rotated in rtl */}
      <StyledPanel dir='ltr'>
        <StyledIconButton aria-label={t('previous')} onClick={playPrevious} size='small'>
          <FastRewindIcon />
        </StyledIconButton>
        <PlayButton
          color='primary'
          sx={{ boxShadow: 3 }}
          aria-label={t(isPlaying ? 'pause' : 'play')}
          onClick={isPlaying ? pause : play}
          disabled={disabled}>
          {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
        </PlayButton>
        <StyledIconButton aria-label={t('next')} onClick={playNext} size='small'>
          <FastForwardIcon />
        </StyledIconButton>
      </StyledPanel>
    </StyledTtsPlayer>
  )
}

export default TtsPlayer
