import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled, { css } from 'styled-components/native'

import { CloseIcon, PauseIcon, PlayIcon, FastRewindIcon, FastForwardIcon } from '../assets'
import { isRTL } from '../constants/contentDirection'
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

const StyledTtsPlayer = styled.View<{ insetBottom: number }>`
  background-color: ${props => props.theme.colors.ttsPlayerBackground};
  border-radius: 8px;
  width: 90%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-self: center;
  position: absolute;
  margin: 8px;
  bottom: ${props => props.insetBottom}px;
  padding: 24px;
  gap: 12px;
  ${elevatedStyle}
`

const StyledPanel = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
`

const StyledButton = styled(Pressable)`
  display: flex;
  flex-direction: row;
  gap: 5px;
  border-radius: 25px;
  align-items: center;
`

const StyledIcon = styled(Icon)<{ disabled?: boolean }>`
  color: ${props => (props.disabled ? props.theme.colors.textDisabledColor : props.theme.colors.textColor)};
  width: 28px;
  height: 28px;
`

const StyledPlayIconButton = styled(IconButton)<{ disabled?: boolean }>`
  background-color: ${props =>
    props.disabled ? props.theme.colors.textDisabledColor : props.theme.colors.ttsPlayerBackground};
  width: 70px;
  height: 50px;
  border-radius: 50px;
  ${elevatedStyle}
`

const PlayButtonIcon = styled(Icon)`
  color: ${props => props.theme.colors.ttsPlayerPlayIconColor};
`

const StyledPlayerHeaderText = styled(Text)`
  font-weight: 600;
  align-self: center;
  font-size: 22px;
  color: ${props => props.theme.colors.textColor};
`

const CloseButton = styled(Pressable)`
  position: absolute;
  ${isRTL() ? `left: 0` : `right: 0`};
  top: 0;
  padding: 12px;
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
    <StyledTtsPlayer insetBottom={bottom}>
      <CloseButton role='button' accessibilityLabel={t('common:close')} onPress={close}>
        <StyledIcon Icon={CloseIcon} />
      </CloseButton>
      <StyledPlayerHeaderText>{title}</StyledPlayerHeaderText>
      <StyledPanel>
        <StyledButton role='button' accessibilityLabel={t('previous')} onPress={playPrevious} disabled={!isPlaying}>
          <StyledIcon Icon={FastRewindIcon} disabled={!isPlaying} />
        </StyledButton>
        <StyledPlayIconButton
          disabled={disabled}
          accessibilityLabel={t(isPlaying ? 'pause' : 'play')}
          onPress={() => (isPlaying ? pause() : play())}
          icon={<PlayButtonIcon Icon={isPlaying ? PauseIcon : PlayIcon} />}
        />
        <StyledButton role='button' accessibilityLabel={t('next')} onPress={playNext} disabled={!isPlaying}>
          <StyledIcon Icon={FastForwardIcon} disabled={!isPlaying} />
        </StyledButton>
      </StyledPanel>
    </StyledTtsPlayer>
  )
}

export default TtsPlayer
