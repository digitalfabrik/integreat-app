import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components/native'

import { CloseIcon, PauseIcon, PlaybackIcon, PlayIcon } from '../assets'
import Icon from './base/Icon'
import IconButton from './base/IconButton'
import Pressable from './base/Pressable'
import Text from './base/Text'

const elevatedStyle = css`
  shadow-color: ${props => props.theme.colors.textColor};
  shadow-offset: 0 2px;
  shadow-opacity: 0.2;
  shadow-radius: 3px;
  elevation: 5;
`

const StyledTtsPlayer = styled.View<{ $isPlaying: boolean }>`
  ${elevatedStyle}
  background-color: ${props => props.theme.colors.grayBackgroundColor};
  border-radius: 28px;
  width: ${props => (props.$isPlaying ? '90%' : '80%')};
  display: flex;
  flex-direction: ${props => (props.$isPlaying ? 'column' : 'row')};
  justify-content: center;
  align-items: center;
  align-self: center;
  position: absolute;
  bottom: 5px;
  min-height: 93px;
  gap: ${props => (props.$isPlaying ? '0px;' : '20px')};
`

const verticalMargin = 11

const StyledPanel = styled.View<{ $isPlaying?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
  margin: ${props => (props.$isPlaying ? verticalMargin : 0)}px 0;
`

const StyledPlayIcon = styled(IconButton)<{ disabled: boolean }>`
  ${elevatedStyle}
  background-color: ${props => (props.disabled ? props.theme.colors.textDisabledColor : props.theme.colors.textColor)};
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
  ${elevatedStyle}
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

const CloseView = styled.View<{ $isPlaying?: boolean }>`
  flex-direction: column;
  gap: 10px;
  margin-bottom: ${props => (props.$isPlaying ? verticalMargin : 0)}px;
`

type TtsPlayerProps = {
  isPlaying: boolean
  sentences: string[]
  playPrevious: () => void
  playNext: () => void
  close: () => void
  pause: () => void
  play: () => void
  title: string
}

const TtsPlayer = ({
  isPlaying,
  playPrevious,
  playNext,
  close,
  pause,
  play,
  title,
  sentences,
}: TtsPlayerProps): ReactElement => {
  const { t } = useTranslation('layout')
  return (
    <StyledTtsPlayer $isPlaying={isPlaying}>
      <StyledPanel $isPlaying={isPlaying}>
        {isPlaying && (
          <StyledBackForthButton role='button' accessibilityLabel={t('previous')} onPress={playPrevious}>
            <StyledText>{t('previous')}</StyledText>
            <Icon Icon={PlaybackIcon} reverse />
          </StyledBackForthButton>
        )}
        <StyledPlayIcon
          disabled={sentences.length === 0}
          accessibilityLabel={t(isPlaying ? 'pause' : 'play')}
          onPress={() => (isPlaying ? pause() : play())}
          icon={<PlayButtonIcon Icon={isPlaying ? PauseIcon : PlayIcon} />}
        />
        {isPlaying && (
          <StyledBackForthButton role='button' accessibilityLabel={t('next')} onPress={playNext}>
            <Icon Icon={PlaybackIcon} />
            <StyledText>{t('next')}</StyledText>
          </StyledBackForthButton>
        )}
      </StyledPanel>
      <CloseView $isPlaying={isPlaying}>
        {!isPlaying && <StyledPlayerHeaderText>{title}</StyledPlayerHeaderText>}
        <CloseButton role='button' accessibilityLabel='Close player' onPress={close}>
          <Icon Icon={CloseIcon} />
          <StyledText>{t('common:close')}</StyledText>
        </CloseButton>
      </CloseView>
    </StyledTtsPlayer>
  )
}

export default TtsPlayer
