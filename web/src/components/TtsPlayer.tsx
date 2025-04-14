import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { CloseIcon, PauseIcon, PlaybackIcon, PlayIcon } from '../assets'
import dimensions from '../constants/dimensions'
import useWindowDimensions from '../hooks/useWindowDimensions'
import Button from './base/Button'
import Icon from './base/Icon'

const StyledTtsPlayer = styled.dialog<{ $isPlaying: boolean; $footerHeight: number }>`
  background-color: ${props => props.theme.colors.ttsPlayerBackground};
  border-radius: 28px;
  width: 388px;
  max-width: 388px;
  display: flex;
  flex-direction: ${props => (props.$isPlaying ? 'column' : 'row')};
  justify-content: center;
  align-items: center;
  padding: 8px;
  position: fixed;
  margin-bottom: 8px;
  bottom: ${props => props.$footerHeight}px;
  min-height: 92px;
  gap: ${props => (props.$isPlaying ? '4px;' : '36px')};
  border-color: transparent;

  @media ${dimensions.smallViewport} {
    width: auto;
  }
`

const verticalMargin = 12

const StyledPanel = styled.div<{ $isPlaying?: boolean }>`
  display: flex;
  align-items: center;
  gap: 20px;
  margin: ${props => (props.$isPlaying ? verticalMargin : 0)}px 0;
  flex-direction: ${props => (props.theme.contentDirection === 'rtl' ? 'row-reverse' : 'row')};
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

const PlayButton = styled(BaseButton)<{ disabled: boolean }>`
  background-color: ${props =>
    props.disabled ? props.theme.colors.textDisabledColor : props.theme.colors.ttsPlayerPlayIconColor};
  width: 48px;
  height: 48px;
  border-radius: 48px;
  box-shadow: 1px 4px 8px 1px grey;
`

const StyledButton = styled(Button)`
  display: flex;
  gap: 4px;
  align-items: flex-end;
  flex-direction: ${props => (props.theme.contentDirection === 'rtl' ? 'row-reverse' : 'row')};
`

const StyledPlayIcon = styled(Icon)`
  color: ${props => props.theme.colors.ttsPlayerBackground};
`

const StyledText = styled.span`
  font-weight: bold;
`

const HeaderText = styled.span`
  font-weight: 600;
  align-self: center;
  font-size: 16px;
`

const CloseButton = styled(BaseButton)`
  border-radius: 8px;
  background-color: ${props => props.theme.colors.themeColor};
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
    <StyledTtsPlayer $isPlaying={isPlaying} $footerHeight={visibleFooterHeight}>
      <StyledPanel $isPlaying={isPlaying}>
        {isPlaying && (
          <StyledButton label={t('previous')} onClick={playPrevious}>
            <StyledText>{t('previous')}</StyledText>
            <Icon reverse src={PlaybackIcon} />
          </StyledButton>
        )}
        <PlayButton label={t(isPlaying ? 'pause' : 'play')} onClick={isPlaying ? pause : play} disabled={disabled}>
          <StyledPlayIcon src={isPlaying ? PauseIcon : PlayIcon} />
        </PlayButton>
        {isPlaying && (
          <StyledButton label={t('next')} onClick={playNext}>
            <Icon src={PlaybackIcon} />
            <StyledText>{t('next')}</StyledText>
          </StyledButton>
        )}
      </StyledPanel>
      <CloseView>
        {!isPlaying && <HeaderText>{title}</HeaderText>}
        <CloseButton label={t('common:close')} onClick={close}>
          <Icon src={CloseIcon} />
          <StyledText>{t('common:close')}</StyledText>
        </CloseButton>
      </CloseView>
    </StyledTtsPlayer>
  )
}

export default TtsPlayer
