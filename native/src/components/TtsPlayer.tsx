import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import { CloseIcon, NoSoundIcon, PauseIcon, PlaybackIcon, PlayIcon, SoundIcon } from '../assets'
import Slider from './Slider'
import Icon from './base/Icon'
import IconButton from './base/IconButton'
import Text from './base/Text'

const StyledTtsPlayer = styled.View<{ $isPlaying: boolean }>`
  background-color: ${props => props.theme.colors.grayBackgroundColor};
  border-radius: 28px;
  width: 85%;
  display: flex;
  flex-direction: ${props => (props.$isPlaying ? 'column' : 'row')};
  justify-content: center;
  align-items: center;
  align-self: center;
  padding: 6px;
  position: absolute;
  bottom: 5px;
  min-height: 93px;
  gap: ${props => (props.$isPlaying ? '5px;' : '10px')};
`

const StyledPanel = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
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

const StyledNoSoundIcon = styled(Icon)`
  height: 18px;
  width: 18px;
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

const CloseView = styled.View`
  flex-direction: column;
  gap: 10px;
`

const elevatedButton = {
  elevation: 5,
  shadowColor: 'black',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 3,
}

type TtsPlayerProps = {
  expandPlayer: boolean
  isPlaying: boolean
  setExpandPlayer: React.Dispatch<React.SetStateAction<boolean>>
  handleBackward: () => Promise<void>
  handleForward: () => Promise<void>
  handleVolumeChange: (newVolume: number) => void
  handleClose: () => Promise<void>
  pauseReading: () => void
  startReading: () => void
  isTitleLong: string
}

const TtsPlayer = ({
  expandPlayer,
  isPlaying,
  setExpandPlayer,
  handleBackward,
  handleForward,
  handleVolumeChange,
  handleClose,
  pauseReading,
  startReading,
  isTitleLong,
}: TtsPlayerProps): ReactElement => {
  const { t } = useTranslation('layout')

  return (
    <StyledTtsPlayer $isPlaying={expandPlayer} style={elevatedButton}>
      <StyledPanel>
        {expandPlayer && (
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
            setExpandPlayer(!isPlaying)
          }}
          icon={<PlayButtonIcon Icon={isPlaying ? PauseIcon : PlayIcon} />}
        />
        {expandPlayer && (
          <StyledBackForthButton accessibilityLabel='Forward Button' onPress={handleForward}>
            <Icon Icon={PlaybackIcon} />
            <StyledText>{t('next')}</StyledText>
          </StyledBackForthButton>
        )}
      </StyledPanel>
      {expandPlayer && (
        <StyledPanel style={{ paddingHorizontal: 10, flexDirection: 'row' }}>
          <StyledNoSoundIcon Icon={NoSoundIcon} />
          <Slider maxValue={100} minValue={0} initialValue={50} onValueChange={handleVolumeChange} />
          <Icon Icon={SoundIcon} />
        </StyledPanel>
      )}
      <CloseView>
        {!expandPlayer && <StyledPlayerHeaderText>{isTitleLong}</StyledPlayerHeaderText>}
        <CloseButton accessibilityLabel='Close player' onPress={handleClose} style={elevatedButton}>
          <Icon Icon={CloseIcon} />
          <StyledText>{t('common:close')}</StyledText>
        </CloseButton>
      </CloseView>
    </StyledTtsPlayer>
  )
}

export default TtsPlayer
