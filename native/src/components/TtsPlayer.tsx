import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'
import { TouchableRipple } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled, { css, useTheme } from 'styled-components/native'

import { isRTLText } from '../constants/contentDirection'
import Icon from './base/Icon'
import IconButton from './base/IconButton'
import Text from './base/Text'

const elevatedStyle = css`
  shadow-color: ${props => props.theme.colors.onSurface};
  shadow-offset: 0 2px;
  shadow-opacity: 0.2;
  shadow-radius: 3px;
  elevation: 5;
`

const StyledTtsPlayer = styled.View<{ insetBottom: number }>`
  background-color: ${props => props.theme.colors.ttsPlayer.background};
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
  padding: 32px 24px 24px;
  gap: 12px;
  ${elevatedStyle}
`

const StyledPanel = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
`

const StyledPlayIconButton = styled(IconButton)<{ disabled?: boolean }>`
  background-color: ${props =>
    props.disabled ? props.theme.colors.onSurfaceDisabled : props.theme.colors.ttsPlayer.background};
  width: 70px;
  height: 50px;
  border-radius: 50px;
  ${elevatedStyle}
`

const styles = StyleSheet.create({
  TouchableRippleStyle: {
    flexDirection: 'row',
    gap: 5,
    borderRadius: 25,
    alignItems: 'center',
    padding: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    padding: 12,
  },
})
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
  const theme = useTheme()
  const { bottom } = useSafeAreaInsets()
  const { t } = useTranslation('layout')

  return (
    <StyledTtsPlayer insetBottom={bottom}>
      <TouchableRipple
        borderless
        role='button'
        accessibilityLabel={t('common:close')}
        onPress={close}
        style={[styles.closeButton, isRTLText(title) ? { left: 0 } : { right: 0 }]}>
        <Icon source='close' />
      </TouchableRipple>
      <Text variant='h4' numberOfLines={1} style={{ alignSelf: 'center' }}>
        {title}
      </Text>
      <StyledPanel>
        <TouchableRipple
          borderless
          role='button'
          accessibilityLabel={t('previous')}
          onPress={playPrevious}
          style={styles.TouchableRippleStyle}>
          <Icon size={28} source='rewind' />
        </TouchableRipple>
        <StyledPlayIconButton
          disabled={disabled}
          accessibilityLabel={t(isPlaying ? 'pause' : 'play')}
          onPress={() => (isPlaying ? pause() : play())}
          icon={<Icon color={theme.colors.ttsPlayer.playIconColor} source={isPlaying ? 'pause' : 'play'} />}
        />
        <TouchableRipple
          borderless
          role='button'
          accessibilityLabel={t('next')}
          onPress={playNext}
          style={styles.TouchableRippleStyle}>
          <Icon size={28} source='fast-forward' />
        </TouchableRipple>
      </StyledPanel>
    </StyledTtsPlayer>
  )
}

export default TtsPlayer
