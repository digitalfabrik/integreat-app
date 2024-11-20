import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { useTheme } from 'styled-components'

import { CloseIcon, PauseIcon, PlaybackIcon, PlayIcon } from '../assets'
import dimensions from '../constants/dimensions'
import TtsHelpModal from './TtsHelpModal'
import Button from './base/Button'
import Icon from './base/Icon'

const StyledTtsPlayer = styled.dialog<{ $isExpanded: boolean }>`
  background-color: #dedede;
  border-radius: 28px;
  width: 388px;
  display: flex;
  flex-direction: ${props => (props.$isExpanded ? 'column' : 'row')};
  justify-content: center;
  align-items: center;
  align-self: center;
  padding: 6px;
  position: sticky;
  bottom: 5px;
  min-height: 93px;
  gap: ${props => (props.$isExpanded ? '5px;' : '10px')};
  border-color: transparent;

  @media ${dimensions.smallViewport} {
    width: 90%;
  }
`

const verticalMargin = 11

const StyledPanel = styled.div<{ $isExpanded?: boolean }>`
  display: flex;
  align-items: center;
  gap: 20px;
  margin: ${props => (props.$isExpanded ? verticalMargin : 0)}px 0;
`

const StyledPlayIcon = styled(Button)`
  background-color: #232323;
  width: 50px;
  height: 50px;
  border-radius: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 1px 5px 10px 1px grey;
  transition:
    box-shadow 0.2s ease,
    transform 0.1s ease;

  &:active {
    box-shadow: none;
    transform: translateY(2px);
  }
`

const StyledBackForthButton = styled(Button)`
  display: flex;
  flex-direction: ${props => (props.theme.contentDirection === 'rtl' ? 'row-reverse ' : 'row')};
  gap: 5px;
  align-items: flex-end;
`

const PlayButtonIcon = styled(Icon)`
  color: #dedede;
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
  font-size: 18px;
`

const CloseButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 7px;
  background-color: ${props => props.theme.colors.themeColor};
  padding: 5px;
  gap: 5px;
  width: 176px;
  box-shadow: 1px 5px 5px 1px grey;
  transition:
    box-shadow 0.2s ease,
    transform 0.1s ease;

  &:active {
    box-shadow: none;
    transform: translateY(2px);
  }
`

const CloseView = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
`

type TtsPlayerProps = {
  showHelpModal: boolean
  setShowHelpModal: (show: boolean) => void
  isVisible: boolean
  isExpanded: boolean
  isPlaying: boolean
  handleBackward: () => void
  handleForward: () => void
  handleClose: () => void
  longTitle: string
  togglePlayPause: () => void
}

const TtsPlayer = ({
  showHelpModal,
  setShowHelpModal,
  isVisible,
  isExpanded,
  isPlaying,
  handleBackward,
  handleForward,
  handleClose,
  longTitle,
  togglePlayPause,
}: TtsPlayerProps): ReactElement | null => {
  const { t } = useTranslation('layout')
  const theme = useTheme()

  if (isVisible) {
    return (
      <>
        {showHelpModal && <TtsHelpModal closeModal={() => setShowHelpModal(false)} />}
        <StyledTtsPlayer $isExpanded={isExpanded}>
          <StyledPanel
            $isExpanded={isExpanded}
            style={{ flexDirection: theme.contentDirection === 'rtl' ? 'row-reverse' : 'row' }}>
            {isExpanded && (
              <StyledBackForthButton label='backward-button' onClick={handleBackward}>
                <StyledText>{t('previous')}</StyledText>
                <BackForthIcon $flip src={PlaybackIcon} />
              </StyledBackForthButton>
            )}
            <StyledPlayIcon label='play-button' onClick={togglePlayPause}>
              <PlayButtonIcon src={isPlaying ? PauseIcon : PlayIcon} />
            </StyledPlayIcon>
            {isExpanded && (
              <StyledBackForthButton label='forward-button' onClick={handleForward}>
                <BackForthIcon $flip={false} src={PlaybackIcon} />
                <StyledText>{t('next')}</StyledText>
              </StyledBackForthButton>
            )}
          </StyledPanel>
          <CloseView>
            {!isExpanded && <StyledPlayerHeaderText>{longTitle}</StyledPlayerHeaderText>}
            <CloseButton label='close-player' onClick={handleClose}>
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
