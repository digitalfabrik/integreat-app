import styled from '@emotion/styled'
import { Close, FastForward, Pause, PlayArrow } from '@mui/icons-material'
import { IconButton, Typography } from '@mui/material'
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

const PlayButton = styled(Button)<{ disabled: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  transition:
    box-shadow 0.2s ease,
    transform 0.1s ease;
  background-color: ${props => {
    if (props.disabled) {
      return props.theme.isContrastTheme
        ? props.theme.colors.ttsPlayerPlayIconColor
        : props.theme.colors.textDisabledColor
    }
    return props.theme.isContrastTheme ? props.theme.colors.textColor : props.theme.colors.ttsPlayerPlayIconColor
  }};
  width: 48px;
  height: 48px;
  border-radius: 48px;
  box-shadow: 1px 4px 8px 1px grey;
`

const StyledIconButton = styled(IconButton)`
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

const StyledFastForwardIcon = styled(FastForward)<{ disabled: boolean; iconRotate?: boolean }>`
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

const CloseIconButton = styled(IconButton)`
  border: none;
  background-color: transparent;
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
  const { visibleFooterHeight } = useWindowDimensions()

  return (
    <StyledTtsPlayer footerHeight={visibleFooterHeight}>
      <CloseIconButton onClick={close} data-testid='close-button'>
        <Close />
      </CloseIconButton>
      <HeaderText>
        <Typography variant='title1'>{title}</Typography>
      </HeaderText>
      {/* Sound player panel shouldn't be rotated in rtl */}
      <StyledPanel dir='ltr'>
        <StyledIconButton data-testid='previous-button' onClick={playPrevious} disabled={!isPlaying}>
          <StyledFastForwardIcon disabled={!isPlaying} iconRotate />
        </StyledIconButton>
        <PlayButton
          data-testid={isPlaying ? 'pause-button' : 'play-button'}
          onClick={isPlaying ? pause : play}
          disabled={disabled}>
          <StyledPlayIcon src={isPlaying ? Pause : PlayArrow} />
        </PlayButton>
        <StyledIconButton data-testid='next-button' onClick={playNext} disabled={!isPlaying}>
          <StyledFastForwardIcon disabled={!isPlaying} />
        </StyledIconButton>
      </StyledPanel>
    </StyledTtsPlayer>
  )
}

export default TtsPlayer
