import styled from '@emotion/styled'
import CloseIcon from '@mui/icons-material/Close'
import FastForwardIcon from '@mui/icons-material/FastForward'
import FastRewindIcon from '@mui/icons-material/FastRewind'
import PauseIcon from '@mui/icons-material/Pause'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import IconButton from '@mui/material/IconButton'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import useWindowDimensions from '../hooks/useWindowDimensions'
import Button from './base/Button'
import Icon from './base/Icon'

const StyledTtsPlayer = styled.dialog<{ isPlaying: boolean; footerHeight: number }>`
  background-color: ${props =>
    props.theme.isContrastTheme ? props.theme.colors.backgroundAccentColor : props.theme.colors.ttsPlayerBackground};
  color: ${props => props.theme.colors.textColor};
  border-radius: 28px;
  width: 388px;
  max-width: 388px;
  display: flex;
  flex-direction: ${props => (props.isPlaying ? 'column' : 'row')};
  justify-content: center;
  align-items: center;
  padding: 8px;
  position: fixed;
  margin-bottom: 8px;
  bottom: ${props => props.footerHeight}px;
  min-height: 92px;
  gap: ${props => (props.isPlaying ? '4px;' : '36px')};
  border-color: transparent;

  ${props => props.theme.breakpoints.down('md')} {
    width: auto;
  }
`

const verticalMargin = 12

const StyledPanel = styled.div<{ isPlaying?: boolean }>`
  display: flex;
  align-items: center;
  gap: 20px;
  margin: ${props => (props.isPlaying ? verticalMargin : 0)}px 0;
`

const BaseButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  transition:
    box-shadow 0.2s ease,
    transform 0.1s ease;

  &:active {
    box-shadow: none;
    transform: translateY(2px);
  }
`

const PlayButton = styled(IconButton)<{ disabled: boolean }>(({ theme, disabled }) => {
  let backgroundColor: string

  if (disabled) {
    backgroundColor = theme.colors.textDisabledColor
  } else if (theme.isContrastTheme) {
    backgroundColor = theme.colors.textColor
  } else {
    backgroundColor = theme.colors.ttsPlayerPlayIconColor
  }

  return {
    backgroundColor,
    width: '48px',
    height: '48px',
    borderRadius: '48px',
    boxShadow: '1px 4px 8px 1px grey',
    transition: 'box-shadow 0.2s ease, transform 0.1s ease',
    '&:active': {
      boxShadow: 'none',
      transform: 'translateY(2px)',
    },
    '& svg': {
      color: theme.isContrastTheme ? theme.colors.backgroundColor : theme.colors.ttsPlayerBackground,
    },
  }
})

const StyledButton = styled(Button)`
  display: flex;
  gap: 4px;
  align-items: center;
`

const StyledCloseIcon = styled(Icon)`
  color: ${props => (props.theme.isContrastTheme ? props.theme.colors.backgroundColor : props.theme.colors.textColor)};
`
const StyledPlaybackIcon = styled(Icon)`
  width: 32px;
  height: 32px;
`

const StyledCloseText = styled.span`
  font-weight: bold;
`

const StyledText = styled.span`
  font-weight: bold;
  color: ${props => props.theme.colors.textColor};
`

const HeaderText = styled.span`
  font-weight: 600;
  align-self: center;
  font-size: 16px;
`

const CloseButton = styled(BaseButton)`
  border-radius: 8px;
  background-color: ${props => props.theme.colors.themeColor};
  color: ${props => (props.theme.isContrastTheme ? props.theme.colors.backgroundColor : props.theme.colors.textColor)};
  padding: 4px 8px;
  gap: 4px;
  box-shadow: 1px 4px 4px 1px grey;
`

const CloseView = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  justify-content: center;
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
  const { t } = useTranslation('layout')
  const { visibleFooterHeight } = useWindowDimensions()

  return (
    <StyledTtsPlayer isPlaying={isPlaying} footerHeight={visibleFooterHeight}>
      <StyledPanel isPlaying={isPlaying}>
        {isPlaying && (
          <StyledButton label={t('previous')} onClick={playPrevious}>
            <StyledText>{t('previous')}</StyledText>
            <StyledPlaybackIcon src={FastRewindIcon} />
          </StyledButton>
        )}
        <PlayButton
          name={t(isPlaying ? 'pause' : 'play')}
          aria-label={t(isPlaying ? 'pause' : 'play')}
          onClick={isPlaying ? pause : play}
          disabled={disabled}
          size='large'>
          {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
        </PlayButton>
        {isPlaying && (
          <StyledButton label={t('next')} onClick={playNext}>
            <StyledPlaybackIcon src={FastForwardIcon} />
            <StyledText>{t('next')}</StyledText>
          </StyledButton>
        )}
      </StyledPanel>
      <CloseView>
        {!isPlaying && <HeaderText>{title}</HeaderText>}
        <CloseButton label={t('common:close')} onClick={close}>
          <StyledCloseIcon src={CloseIcon} />
          <StyledCloseText>{t('common:close')}</StyledCloseText>
        </CloseButton>
      </CloseView>
    </StyledTtsPlayer>
  )
}

export default TtsPlayer
