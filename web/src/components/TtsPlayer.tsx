import styled from '@emotion/styled'
import CloseIcon from '@mui/icons-material/Close'
import FastForwardIcon from '@mui/icons-material/FastForward'
import PauseIcon from '@mui/icons-material/Pause'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import { Typography } from '@mui/material'
import Button from '@mui/material/Button'
import React, { ReactElement } from 'react'

import useWindowDimensions from '../hooks/useWindowDimensions'
import Icon from './base/Icon'

const StyledTtsPlayer = styled.dialog<{ footerHeight: number }>`
  background-color: ${props =>
    props.theme.isContrastTheme ? props.theme.colors.backgroundAccentColor : props.theme.colors.ttsPlayerBackground};
  color: ${props => props.theme.colors.textColor};
  border-radius: 8px;
  width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 24px;
  position: fixed;
  margin-bottom: 12px;
  bottom: ${props => props.footerHeight}px;
  gap: 16px;
  border-color: transparent;
  opacity: 0.98;

  ${props => props.theme.breakpoints.down('md')} {
    width: auto;
    margin: 12px;
  }
`

const StyledPanel = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`

const BaseButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  transition:
    box-shadow 0.2s ease,
    transform 0.1s ease;
`

const PlayButton = styled(BaseButton)<{ disabled: boolean }>`
  background-color: ${props => {
    if (props.disabled) {
      return props.theme.colors.textDisabledColor
    }
    return props.theme.isContrastTheme ? props.theme.colors.textColor : props.theme.colors.ttsPlayerPlayIconColor
  }};
  width: 48px;
  height: 48px;
  border-radius: 48px;
  box-shadow: 1px 4px 8px 1px grey;
`

const StyledButton = styled(Button)`
  display: flex;
  gap: 4px;
  align-items: center;
`

const StyledPlayIcon = styled(Icon)`
  width: 32px;
  height: 32px;
  color: ${props =>
    props.theme.isContrastTheme ? props.theme.colors.backgroundColor : props.theme.colors.ttsPlayerBackground};
`

const StyledCloseIcon = styled(Icon)`
  color: ${props => props.theme.colors.textColor};
`

const StyledFastForwardIcon = styled(FastForwardIcon)<{ disabled: boolean; iconRotate?: boolean }>`
  ${props => (props.iconRotate ? 'rotate: 180deg;' : '')}
  color: ${props => {
    if (props.disabled) {
      return props.theme.isContrastTheme
        ? props.theme.colors.ttsPlayerPlayIconColor
        : props.theme.colors.textDisabledColor
    }
    return props.theme.isContrastTheme ? props.theme.colors.textColor : props.theme.colors.ttsPlayerPlayIconColor
  }};
  width: 32px;
  height: 32px;
`

const HeaderText = styled.span`
  font-weight: 600;
  align-self: center;
  font-size: 16px;
`

const CloseButton = styled(BaseButton)`
  border: none;
  background-color: transparent;
  top: 0;
  right: -12px;
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
  const { visibleFooterHeight } = useWindowDimensions()

  return (
    <StyledTtsPlayer footerHeight={visibleFooterHeight}>
      <CloseButton onClick={close} data-testid='close-button'>
        <StyledCloseIcon src={CloseIcon} />
      </CloseButton>
      <HeaderText>
        <Typography variant='title1'>{title}</Typography>
      </HeaderText>
      <StyledPanel>
        <StyledButton
          data-testid='previous-button'
          onClick={playPrevious}
          disabled={!isPlaying}
          startIcon={<StyledFastForwardIcon disabled={!isPlaying} iconRotate />}
        />
        <PlayButton
          data-testid={isPlaying ? 'pause-button' : 'play-button'}
          onClick={isPlaying ? pause : play}
          disabled={disabled}>
          <StyledPlayIcon src={isPlaying ? PauseIcon : PlayArrowIcon} />
        </PlayButton>
        <StyledButton
          data-testid='next-button'
          onClick={playNext}
          disabled={!isPlaying}
          endIcon={<StyledFastForwardIcon disabled={!isPlaying} />}
        />
      </StyledPanel>
    </StyledTtsPlayer>
  )
}

export default TtsPlayer
