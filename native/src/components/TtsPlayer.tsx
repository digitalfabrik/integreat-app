import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import { CloseIcon, PauseIcon, PlaybackIcon, PlayIcon } from '../assets'
import Icon from './base/Icon'
import IconButton from './base/IconButton'
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

const StyledBackForthButton = styled.TouchableOpacity`
  display: flex;
  flex-direction: row;
  gap: 5px;
  align-items: flex-end;
`

const PlayButtonIcon = styled(Icon)`
  color: ${props => props.theme.colors.grayBackgroundColor};
`

const FlipView = styled.View`
  transform: scaleX(-1);
`

const StyledText = styled(Text)`
  font-weight: bold;
`

const StyledPlayerHeaderText = styled(Text)`
  font-weight: 600;
  align-self: center;
  font-size: 18px;
`

const CloseButton = styled.TouchableOpacity`
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
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>
  handleBackward: () => Promise<void>
  handleForward: () => Promise<void>
  handleClose: () => Promise<void>
  pauseReading: () => void
  startReading: () => void
  isTitleLong: string
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
  isTitleLong,
}: TtsPlayerProps): ReactElement => {
  const { t } = useTranslation('layout')

  return (
    <StyledTtsPlayer $isExpanded={isExpanded} style={elevatedButton}>
      <StyledPanel $isExpanded={isExpanded}>
        {isExpanded && (
          <StyledBackForthButton accessibilityLabel='backward Button' onPress={handleBackward}>
            <StyledText>{t('prev')}</StyledText>
            <FlipView>
              <Icon Icon={PlaybackIcon} />
            </FlipView>
          </StyledBackForthButton>
        )}
        <StyledPlayIcon
          style={elevatedButton}
          accessibilityLabel='Play Button'
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
          <StyledBackForthButton accessibilityLabel='Forward Button' onPress={handleForward}>
            <Icon Icon={PlaybackIcon} />
            <StyledText>{t('next')}</StyledText>
          </StyledBackForthButton>
        )}
      </StyledPanel>
      <CloseView $isExpanded={isExpanded}>
        {!isExpanded && <StyledPlayerHeaderText>{isTitleLong}</StyledPlayerHeaderText>}
        <CloseButton accessibilityLabel='Close player' onPress={handleClose} style={elevatedButton}>
          <Icon Icon={CloseIcon} />
          <StyledText>{t('common:close')}</StyledText>
        </CloseButton>
      </CloseView>
    </StyledTtsPlayer>
  )
}

export default TtsPlayer
