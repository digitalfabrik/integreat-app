import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { useTheme } from 'styled-components'

import { CloseIcon, PauseIcon, PlaybackIcon, PlayIcon } from '../assets'
import dimensions from '../constants/dimensions'
import TtsHelpModal from './TtsHelpModal'
import Button from './base/Button'
import Icon from './base/Icon'

const StyledTtsPlayer = styled.dialog<{ $isPlaying: boolean }>`
  background-color: ${props => props.theme.colors.ttsPlayerBackground};
  border-radius: 28px;
  width: 388px;
  display: flex;
  flex-direction: ${props => (props.$isPlaying ? 'column' : 'row')};
  justify-content: center;
  align-items: center;
  padding: 8px;
  position: sticky;
  bottom: 4px;
  min-height: 92px;
  gap: ${props => (props.$isPlaying ? '4px;' : '12px')};
  border-color: transparent;

  @media ${dimensions.smallViewport} {
    width: 88%;
  }
`

const verticalMargin = 12

const StyledPanel = styled.div<{ $isPlaying?: boolean }>`
  display: flex;
  align-items: center;
  gap: 20px;
  margin: ${props => (props.$isPlaying ? verticalMargin : 0)}px 0;
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

const StyledPlayIcon = styled(BaseButton)`
  background-color: ${props => props.theme.colors.ttsPlayerPlayIconColor};
  width: 48px;
  height: 48px;
  border-radius: 48px;
  box-shadow: 1px 4px 8px 1px grey;
`

const StyledBackForthButton = styled(Button)`
  display: flex;
  flex-direction: row;
  gap: 4px;
  align-items: flex-end;
`

const PlayButtonIcon = styled(Icon)`
  color: ${props => props.theme.colors.ttsPlayerBackground};
`

const BackForthIcon = styled(Icon)<{ $flip: boolean }>`
  transform: ${props => (props.$flip ? 'scaleX(-1)' : '')};
`

const StyledText = styled.span`
  font-weight: bold;
`

const StyledPlayerHeaderText = styled.span`
  font-weight: 600;
  align-self: center;
  font-size: 16px;
`

const CloseButton = styled(BaseButton)`
  border-radius: 8px;
  background-color: ${props => props.theme.colors.themeColor};
  padding: 4px;
  gap: 4px;
  width: 176px;
  box-shadow: 1px 4px 4px 1px grey;
`

const CloseView = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  justify-content: center;
`

type TtsPlayerProps = {
  showHelpModal: boolean
  setShowHelpModal: (show: boolean) => void
  isVisible: boolean
  isPlaying: boolean
  playPrevious: () => void
  playNext: () => void
  close: () => void
  title: string
  togglePlayPause: () => void
}

const TtsPlayer = ({
  showHelpModal,
  setShowHelpModal,
  isVisible,
  isPlaying,
  playPrevious,
  playNext,
  close,
  title,
  togglePlayPause,
}: TtsPlayerProps): ReactElement | null => {
  const { t } = useTranslation('layout')
  const theme = useTheme()

  if (isVisible) {
    return (
      <>
        {showHelpModal && (
          <TtsHelpModal
            closeModal={() => {
              setShowHelpModal(false)
              togglePlayPause()
            }}
          />
        )}
        <StyledTtsPlayer $isPlaying={isPlaying}>
          <StyledPanel
            $isPlaying={isPlaying}
            style={{ flexDirection: theme.contentDirection === 'rtl' ? 'row-reverse' : 'row' }}>
            {isPlaying && (
              <StyledBackForthButton label={t('previous')} onClick={playPrevious}>
                <StyledText>{t('previous')}</StyledText>
                <BackForthIcon $flip src={PlaybackIcon} />
              </StyledBackForthButton>
            )}
            <StyledPlayIcon label={t(isPlaying ? 'pause' : 'play')} onClick={togglePlayPause}>
              <PlayButtonIcon src={isPlaying ? PauseIcon : PlayIcon} />
            </StyledPlayIcon>
            {isPlaying && (
              <StyledBackForthButton label={t('next')} onClick={playNext}>
                <BackForthIcon $flip={false} src={PlaybackIcon} />
                <StyledText>{t('next')}</StyledText>
              </StyledBackForthButton>
            )}
          </StyledPanel>
          <CloseView>
            {!isPlaying && <StyledPlayerHeaderText>{title}</StyledPlayerHeaderText>}
            <CloseButton label={t('common:close')} onClick={close}>
              <Icon src={CloseIcon} />
              <StyledText>{t('common:close')}</StyledText>
            </CloseButton>
          </CloseView>
        </StyledTtsPlayer>
      </>
    )
  }

  return null
}

export default TtsPlayer
