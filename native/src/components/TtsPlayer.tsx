import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled, { css } from 'styled-components/native'

import { CloseIcon, PauseIcon, PlayIcon, FastRewindIcon, FastForwardIcon } from '../assets'
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

const extraBottomMargin = 8
const StyledTtsPlayer = styled.View<{ $isPlaying: boolean; bottom: number }>`
  background-color: ${props => props.theme.colors.ttsPlayerBackground};
  border-radius: 28px;
  width: ${props => (props.$isPlaying ? '90%' : '80%')};
  display: flex;
  flex-direction: ${props => (props.$isPlaying ? 'column' : 'row')};
  justify-content: center;
  align-items: center;
  align-self: center;
  position: absolute;
  bottom: ${props => props.bottom + extraBottomMargin}px;
  min-height: 112px;
  gap: ${props => (props.$isPlaying ? '0px;' : '20px')};
  padding: 8px;
  ${elevatedStyle}
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
  background-color: ${props =>
    props.disabled ? props.theme.colors.textDisabledColor : props.theme.colors.ttsPlayerPlayIconColor};
  width: 50px;
  height: 50px;
  border-radius: 50px;
  ${elevatedStyle}
`

const StyledBackForthButton = styled(Pressable)`
  display: flex;
  flex-direction: row;
  gap: 5px;
  align-items: center;
`

const PlayButtonIcon = styled(Icon)`
  color: ${props => props.theme.colors.ttsPlayerBackground};
`

const StyledText = styled(Text)`
  font-weight: bold;
  color: ${props => (props.theme.isContrastTheme ? props.theme.colors.backgroundColor : props.theme.colors.textColor)};
`

const StyledPlayerHeaderText = styled(Text)`
  font-weight: 600;
  align-self: center;
  font-size: 18px;
  color: ${props => (props.theme.isContrastTheme ? props.theme.colors.backgroundColor : props.theme.colors.textColor)};
`

const StyledIcon = styled(Icon)`
  color: ${props => (props.theme.isContrastTheme ? props.theme.colors.backgroundColor : props.theme.colors.textColor)};
  width: 28px;
  height: 28px;
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
  ${elevatedStyle}
`

const CloseView = styled.View<{ $isPlaying?: boolean }>`
  flex-direction: column;
  gap: 10px;
  margin-bottom: ${props => (props.$isPlaying ? verticalMargin : 0)}px;
`

type TtsPlayerProps = {
  isPlaying: boolean
  disabled: boolean
  playPrevious: () => void
  playNext: () => void
  close: () => Promise<void>
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
  disabled,
}: TtsPlayerProps): ReactElement => {
  const { bottom } = useSafeAreaInsets()
  const { t } = useTranslation('layout')
  return (
    <StyledTtsPlayer $isPlaying={isPlaying} bottom={bottom}>
      <StyledPanel $isPlaying={isPlaying}>
        {isPlaying && (
          <StyledBackForthButton role='button' accessibilityLabel={t('previous')} onPress={playPrevious}>
            <StyledText>{t('previous')}</StyledText>
            <StyledIcon Icon={FastRewindIcon} />
          </StyledBackForthButton>
        )}
        <StyledPlayIcon
          disabled={disabled}
          accessibilityLabel={t(isPlaying ? 'pause' : 'play')}
          onPress={() => (isPlaying ? pause() : play())}
          icon={<PlayButtonIcon Icon={isPlaying ? PauseIcon : PlayIcon} />}
        />
        {isPlaying && (
          <StyledBackForthButton role='button' accessibilityLabel={t('next')} onPress={playNext}>
            <StyledIcon Icon={FastForwardIcon} />
            <StyledText>{t('next')}</StyledText>
          </StyledBackForthButton>
        )}
      </StyledPanel>
      <CloseView $isPlaying={isPlaying}>
        {!isPlaying && <StyledPlayerHeaderText>{title}</StyledPlayerHeaderText>}
        <CloseButton role='button' accessibilityLabel='Close player' onPress={close}>
          <StyledIcon Icon={CloseIcon} />
          <StyledText>{t('common:close')}</StyledText>
        </CloseButton>
      </CloseView>
    </StyledTtsPlayer>
  )
}

export default TtsPlayer
