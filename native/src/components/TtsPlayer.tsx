import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import { CloseIcon, PauseIcon, PlaybackIcon, PlayIcon } from '../assets'
import Icon from './base/Icon'
import IconButton from './base/IconButton'
import Pressable from './base/Pressable'
import Text from './base/Text'

const StyledTtsPlayer = styled.View<{ $isExpanded: boolean }>`
  background-color: ${props => props.theme.colors.grayBackgroundColor};
  border-radius: 28px;
  width: ${props => (props.$isExpanded ? '90%' : '80%')};
  display: flex;
  flex-direction: ${props => (props.$isExpanded ? 'column' : 'row')};
  justify-content: center;
  align-items: center;
  align-self: center;
  position: absolute;
  bottom: 5px;
  min-height: 93px;
  gap: ${props => (props.$isExpanded ? '0px;' : '10px')};
`

const verticalMargin = 11

const StyledPanel = styled.View<{ $isExpanded?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
  margin: ${props => (props.$isExpanded ? verticalMargin : 0)}px 0;
`

const StyledPlayIcon = styled(IconButton)`
  background-color: ${props => props.theme.colors.textColor};
  width: 50px;
  height: 50px;
  border-radius: 50px;
`

const StyledBackForthButton = styled(Pressable)`
  display: flex;
  flex-direction: row;
  gap: 5px;
  align-items: flex-end;
`

const PlayButtonIcon = styled(Icon)`
  color: ${props => props.theme.colors.grayBackgroundColor};
`

const StyledText = styled(Text)`
  font-weight: bold;
`

const StyledPlayerHeaderText = styled(Text)`
  font-weight: 600;
  align-self: center;
  font-size: 18px;
`

const CloseButton = styled(Pressable)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 7px;
  background-color: ${props => props.theme.colors.themeColor};
  padding: 5px;
  gap: 5px;
  width: 176px;
`

const CloseView = styled.View<{ $isExpanded?: boolean }>`
  flex-direction: column;
  gap: 10px;
  margin-bottom: ${props => (props.$isExpanded ? verticalMargin : 0)}px;
`

const elevatedButton = {
  elevation: 5,
  shadowColor: 'black',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 3,
}

type TtsPlayerProps = {
  isExpanded: boolean
  isPlaying: boolean
  setIsExpanded: (expanded: boolean) => void
  handleBackward: () => Promise<void>
  handleForward: () => Promise<void>
  handleClose: () => Promise<void>
  pauseReading: () => void
  startReading: () => void
  title: string
}

const TtsPlayer = ({
  isExpanded,
  isPlaying,
  setIsExpanded,
  handleBackward,
  handleForward,
  handleClose,
  pauseReading,
  startReading,
  title,
}: TtsPlayerProps): ReactElement => {
  const { t } = useTranslation('layout')

  return (
    <StyledTtsPlayer $isExpanded={isExpanded} style={elevatedButton}>
      <StyledPanel $isExpanded={isExpanded}>
        {isExpanded && (
          <StyledBackForthButton role='button' accessibilityLabel={t('previous')} onPress={handleBackward}>
            <StyledText>{t('previous')}</StyledText>
            <Icon Icon={PlaybackIcon} reverse />
          </StyledBackForthButton>
        )}
        <StyledPlayIcon
          style={elevatedButton}
          accessibilityLabel={t(isPlaying ? 'pause' : 'play')}
          onPress={() => {
            if (isPlaying) {
              pauseReading()
            } else {
              startReading()
            }
            setIsExpanded(!isPlaying)
          }}
          icon={<PlayButtonIcon Icon={isPlaying ? PauseIcon : PlayIcon} />}
        />
        {isExpanded && (
          <StyledBackForthButton role='button' accessibilityLabel={t('next')} onPress={handleForward}>
            <Icon Icon={PlaybackIcon} />
            <StyledText>{t('next')}</StyledText>
          </StyledBackForthButton>
        )}
      </StyledPanel>
      <CloseView $isExpanded={isExpanded}>
        {!isExpanded && <StyledPlayerHeaderText>{title}</StyledPlayerHeaderText>}
        <CloseButton role='button' accessibilityLabel='Close player' onPress={handleClose} style={elevatedButton}>
          <Icon Icon={CloseIcon} />
          <StyledText>{t('common:close')}</StyledText>
        </CloseButton>
      </CloseView>
    </StyledTtsPlayer>
  )
}

export default TtsPlayer
